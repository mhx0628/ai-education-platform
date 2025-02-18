import { Organization } from '../models/Organization.js';
import { maxKBService } from './maxkb.service.js';
import { createError } from '../utils/error.js';

class CampusBrainService {
  constructor() {
    this.maxkb = maxKBService;
  }

  async initializeBrain(orgId) {
    const org = await Organization.findById(orgId);
    if (!org) {
      throw createError(404, '组织机构不存在');
    }

    // 创建教育专用智能体
    const agents = await this.maxkb.createAgents([
      {
        name: 'TeachingAssistant',
        type: 'education',
        description: '教学助手智能体',
        capabilities: ['lesson_planning', 'homework_review', 'qa_support']
      },
      {
        name: 'CampusAnalyst',
        type: 'analytics',
        description: '校园数据分析智能体',
        capabilities: ['data_analysis', 'report_generation', 'trend_prediction']
      },
      {
        name: 'SafetyGuardian',
        type: 'security',
        description: '校园安全守护智能体',
        capabilities: ['anomaly_detection', 'emergency_response', 'safety_monitoring']
      }
    ]);

    return agents;
  }

  async processEvent(orgId, event) {
    try {
      // 获取组织配置的智能体
      const agents = await this.getOrganizationAgents(orgId);
      
      // 智能体协作处理事件
      const result = await this.maxkb.collaborativeTask(
        {
          type: event.type,
          data: event.data,
          context: await this.getEventContext(orgId, event)
        },
        agents.map(a => a.id)
      );

      // 根据处理结果生成响应或预警
      if (result.requiresAction) {
        await this.generateAlert(orgId, result);
      }

      return result;
    } catch (err) {
      throw createError(500, '事件处理失败: ' + err.message);
    }
  }

  async generateAnalytics(orgId, timeRange, metrics) {
    try {
      const org = await Organization.findById(orgId);
      const data = await this.collectMetricsData(org, timeRange, metrics);
      
      // 使用分析智能体生成报告
      const analysis = await this.maxkb.collaborativeTask(
        {
          type: 'analytics',
          data: data,
          requirements: {
            format: 'report',
            focus: metrics
          }
        },
        ['CampusAnalyst']
      );

      return analysis;
    } catch (err) {
      throw createError(500, '分析生成失败: ' + err.message);
    }
  }

  async monitorSafety(orgId) {
    // 实时安全监控实现
    // ...
  }
}

export const campusBrainService = new CampusBrainService();
