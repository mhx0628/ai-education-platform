import { Organization } from '../models/Organization.js';
import { createError } from '../utils/error.js';
import { maxKBService } from './maxkb.service.js';
import logger from '../utils/logger.js';

class OrganizationService {
  async initializeOrg(orgData) {
    try {
      // 创建组织
      const organization = await Organization.create(orgData);

      // 初始化知识库
      await this.initializeKnowledgeBase(organization._id);

      // 初始化智能体
      await this.initializeAgents(organization._id);

      return organization;
    } catch (error) {
      logger.error('组织初始化失败:', error);
      throw createError(500, '组织初始化失败');
    }
  }

  async initializeKnowledgeBase(orgId) {
    try {
      // 创建组织专属知识库
      await maxKBService.createCollection({
        name: `org_${orgId}`,
        description: '组织知识库',
        schema: {
          title: 'string',
          content: 'text',
          type: 'string',
          tags: ['string'],
          department: 'string',
          author: 'string',
          createTime: 'date'
        }
      });

      // 导入基础教育知识
      await this.importBaseKnowledge(orgId);

    } catch (error) {
      logger.error('知识库初始化失败:', error);
      throw error;
    }
  }

  async initializeAgents(orgId) {
    try {
      const organization = await Organization.findById(orgId);
      if (!organization) {
        throw createError(404, '组织不存在');
      }

      const agents = [];
      
      // 根据组织类型创建不同的智能体
      if (organization.type === 'school') {
        agents.push(
          {
            name: 'SchoolBrain',
            type: 'management',
            capabilities: ['data_analysis', 'alert', 'recommendation']
          },
          {
            name: 'TeachingAssistant',
            type: 'education',
            capabilities: ['lesson_planning', 'content_creation', 'evaluation']
          }
        );
      } else if (organization.type === 'district') {
        agents.push(
          {
            name: 'DistrictAnalyst',
            type: 'management',
            capabilities: ['resource_allocation', 'performance_analysis']
          }
        );
      }

      const createdAgents = await maxKBService.createAgents(agents);
      
      // 更新组织配置
      await Organization.findByIdAndUpdate(orgId, {
        'brain.agents': createdAgents.map(agent => ({
          id: agent.id,
          name: agent.name,
          type: agent.type
        }))
      });

      return createdAgents;
    } catch (error) {
      logger.error('智能体初始化失败:', error);
      throw error;
    }
  }

  private async importBaseKnowledge(orgId) {
    const baseKnowledge = [
      {
        title: '课程标准',
        content: '...课程标准内容...',
        type: 'standard',
        department: 'education'
      },
      {
        title: '教学方法论',
        content: '...教学方法内容...',
        type: 'methodology',
        department: 'education'
      }
    ];

    await maxKBService.batchInsert(`org_${orgId}`, baseKnowledge);
  }
}

export const organizationService = new OrganizationService();
