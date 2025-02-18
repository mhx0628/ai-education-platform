import { Organization } from '../models/Organization.js';
import { maxKBService } from './maxkb.service.js';
import { analyticsService } from './analytics.service.js';
import { createError } from '../utils/error.js';

class AlertService {
  constructor() {
    this.alertLevels = {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      CRITICAL: 'critical'
    };
  }

  async monitorStudent(studentId) {
    try {
      const metrics = await analyticsService.generateStudentReport(studentId, 'daily');
      
      // AI分析异常指标
      const alerts = await this.analyzeMetrics(metrics, 'student');
      
      if (alerts.length > 0) {
        await this.processAlerts(alerts, { studentId });
      }

      return alerts;
    } catch (err) {
      throw createError(500, '学生监控失败: ' + err.message);
    }
  }

  async monitorClass(classId) {
    try {
      const metrics = await analyticsService.generateClassReport(classId);
      const alerts = await this.analyzeMetrics(metrics, 'class');
      
      if (alerts.some(a => a.level === this.alertLevels.HIGH)) {
        await this.notifyTeachers(classId, alerts);
      }

      return alerts;
    } catch (err) {
      throw createError(500, '班级监控失败: ' + err.message);
    }
  }

  async monitorSchool(schoolId) {
    try {
      const org = await Organization.findById(schoolId);
      if (!org.brain.features.monitoring) {
        return [];
      }

      // 获取智慧校园数据
      const campusData = await this.getCampusData(schoolId);
      const alerts = [];

      // 监控各个系统
      await Promise.all([
        this.monitorSafety(campusData.safety),
        this.monitorAttendance(campusData.attendance),
        this.monitorAcademic(campusData.academic),
        this.monitorHealth(campusData.health)
      ]).then(results => {
        alerts.push(...results.flat());
      });

      // AI分析预警
      const aiAnalysis = await maxKBService.collaborativeTask(
        {
          type: 'alert_analysis',
          data: alerts,
          context: campusData
        },
        ['SafetyGuardian', 'CampusAnalyst']
      );

      // 处理紧急预警
      await this.handleEmergencyAlerts(aiAnalysis.emergencyAlerts);

      return aiAnalysis;
    } catch (err) {
      throw createError(500, '学校监控失败: ' + err.message);
    }
  }

  private async analyzeMetrics(metrics, type) {
    const thresholds = await this.getThresholds(type);
    const alerts = [];

    for (const [metric, value] of Object.entries(metrics)) {
      const threshold = thresholds[metric];
      if (threshold && this.isAnomalous(value, threshold)) {
        alerts.push({
          type,
          metric,
          value,
          threshold,
          level: this.calculateAlertLevel(value, threshold),
          timestamp: new Date()
        });
      }
    }

    return alerts;
  }

  private async processAlerts(alerts, context) {
    for (const alert of alerts) {
      switch (alert.level) {
        case this.alertLevels.CRITICAL:
          await this.handleCriticalAlert(alert, context);
          break;
        case this.alertLevels.HIGH:
          await this.handleHighAlert(alert, context);
          break;
        default:
          await this.logAlert(alert, context);
      }
    }
  }

  private async handleEmergencyAlerts(alerts) {
    if (!alerts || alerts.length === 0) return;

    // 通知紧急联系人
    await this.notifyEmergencyContacts(alerts);
    
    // 自动响应措施
    await this.triggerEmergencyResponse(alerts);
  }
}

export const alertService = new AlertService();
