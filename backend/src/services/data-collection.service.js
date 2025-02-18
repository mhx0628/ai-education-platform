import { LearningRecord } from '../models/LearningRecord.js';
import { Organization } from '../models/Organization.js';
import { createError } from '../utils/error.js';

class DataCollectionService {
  async collectStudentData(studentId, period = 'daily') {
    try {
      const data = {
        learning: await this.collectLearningData(studentId, period),
        behavior: await this.collectBehaviorData(studentId, period),
        performance: await this.collectPerformanceData(studentId, period),
        activities: await this.collectActivityData(studentId, period)
      };

      // 存储采集的数据
      await this.saveCollectedData(studentId, data);
      return data;
    } catch (err) {
      throw createError(500, '数据采集失败: ' + err.message);
    }
  }

  async collectClassData(classId, metrics) {
    try {
      const students = await this.getClassStudents(classId);
      const data = await Promise.all(
        students.map(student => this.collectStudentData(student._id))
      );
      return this.aggregateClassData(data, metrics);
    } catch (err) {
      throw createError(500, '班级数据采集失败: ' + err.message);
    }
  }

  async collectSchoolData(schoolId) {
    try {
      const org = await Organization.findById(schoolId);
      if (!org || org.type !== 'school') {
        throw createError(404, '学校不存在');
      }

      const data = {
        academic: await this.collectAcademicData(schoolId),
        attendance: await this.collectAttendanceData(schoolId),
        activities: await this.collectSchoolActivities(schoolId),
        safety: await this.collectSafetyData(schoolId)
      };

      // 整合智慧校园数据
      await this.integrateSmartCampusData(schoolId, data);
      
      return data;
    } catch (err) {
      throw createError(500, '学校数据采集失败: ' + err.message);
    }
  }

  async integrateSmartCampusData(schoolId, data) {
    const org = await Organization.findById(schoolId)
      .select('brain.integrations');
    
    // 遍历集成的系统
    for (const integration of org.brain.integrations) {
      if (integration.status === 'active') {
        try {
          const systemData = await this.fetchSystemData(integration);
          data[integration.system] = systemData;
        } catch (err) {
          console.error(`集成系统 ${integration.system} 数据获取失败:`, err);
        }
      }
    }
  }

  async fetchSystemData(integration) {
    // 根据不同系统类型获取数据
    switch (integration.system) {
      case 'monitoring':
        return await this.fetchMonitoringData(integration);
      case 'attendance':
        return await this.fetchAttendanceData(integration);
      case 'academic':
        return await this.fetchAcademicData(integration);
      default:
        return null;
    }
  }
}

export const dataCollectionService = new DataCollectionService();
