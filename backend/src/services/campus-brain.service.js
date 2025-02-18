import { DeepseekAPI } from '../utils/deepseek.js';
import { logger } from '../utils/logger.js';
import { CampusEvent } from '../models/CampusEvent.js';

class CampusBrainService {
  constructor() {
    this.ai = new DeepseekAPI({
      baseURL: process.env.DEEPSEEK_API_ENDPOINT,
      apiKey: process.env.DEEPSEEK_API_KEY
    });
    
    // 初始化监控系统
    this.monitoringSystems = {
      cameras: new CameraSystem(),
      attendance: new AttendanceSystem(),
      classroom: new ClassroomSystem(),
      security: new SecuritySystem()
    };
  }

  async processCampusEvent(eventData) {
    try {
      // 事件分类和优先级判断
      const analysis = await this.analyzeEvent(eventData);
      
      // 记录事件
      await CampusEvent.create({
        ...eventData,
        analysis,
        timestamp: new Date()
      });

      // 根据事件类型分发处理
      await this.dispatchEvent(eventData, analysis);

      return {
        status: 'success',
        analysis
      };
    } catch (error) {
      logger.error('处理校园事件失败:', error);
      throw error;
    }
  }

  async monitorCampusStatus() {
    try {
      // 收集各系统状态
      const systemStatus = await this.collectSystemStatus();
      
      // AI分析当前状态
      const analysis = await this.ai.analyzeCampusStatus(systemStatus);
      
      // 检查是否需要预警
      if (analysis.alerts.length > 0) {
        await this.handleAlerts(analysis.alerts);
      }

      return {
        status: systemStatus,
        analysis,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('监控校园状态失败:', error);
      throw error;
    }
  }

  private async analyzeEvent(eventData) {
    const prompt = `分析以下校园事件的类型、优先级和潜在影响：${JSON.stringify(eventData)}`;
    const response = await this.ai.generate(prompt);
    return JSON.parse(response);
  }

  private async dispatchEvent(eventData, analysis) {
    switch(analysis.type) {
      case 'security':
        await this.monitoringSystems.security.handleEvent(eventData);
        break;
      case 'attendance':
        await this.monitoringSystems.attendance.handleEvent(eventData);
        break;
      case 'classroom':
        await this.monitoringSystems.classroom.handleEvent(eventData);
        break;
      default:
        logger.warn('未知事件类型:', analysis.type);
    }
  }

  private async collectSystemStatus() {
    return {
      cameras: await this.monitoringSystems.cameras.getStatus(),
      attendance: await this.monitoringSystems.attendance.getStatus(),
      classroom: await this.monitoringSystems.classroom.getStatus(),
      security: await this.monitoringSystems.security.getStatus()
    };
  }

  private async handleAlerts(alerts) {
    // 处理预警信息
    for (const alert of alerts) {
      await this.notifyRelevantPersonnel(alert);
      if (alert.requiresImmediate) {
        await this.triggerEmergencyResponse(alert);
      }
    }
  }
}

export const campusBrainService = new CampusBrainService();
