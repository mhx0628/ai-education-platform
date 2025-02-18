import { MaxKBClient } from '../utils/maxkb-client.js';
import { User } from '../models/User.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class MaxKBIntegrationService {
  constructor() {
    this.client = new MaxKBClient({
      endpoint: process.env.MAXKB_ENDPOINT,
      apiKey: process.env.MAXKB_API_KEY
    });
  }

  async syncUserProfile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw createError(404, '用户不存在');
      }

      // 同步用户到MaxKB
      const maxkbUser = await this.client.users.create({
        externalId: user._id.toString(),
        name: user.username,
        email: user.email,
        role: user.role,
        metadata: {
          school: user.affiliations.schoolId,
          class: user.affiliations.classId
        }
      });

      // 更新用户的MaxKB ID
      await User.updateOne(
        { _id: userId },
        { 'integrations.maxkb.userId': maxkbUser.id }
      );

      return maxkbUser;
    } catch (error) {
      logger.error('MaxKB用户同步失败:', error);
      throw error;
    }
  }

  async createKnowledgeBase(params) {
    const { name, description, type, ownerId } = params;

    try {
      // 创建知识库
      const kb = await this.client.knowledgeBases.create({
        name,
        description,
        type,
        owner: ownerId,
        settings: {
          language: 'zh',
          allowContributions: true,
          moderationEnabled: true
        }
      });

      // 初始化基础目录结构
      await this.initializeKBStructure(kb.id);

      return kb;
    } catch (error) {
      logger.error('创建知识库失败:', error);
      throw error;
    }
  }

  async addDocument(params) {
    const { kbId, document, metadata } = params;

    try {
      // 添加文档到知识库
      const result = await this.client.documents.add({
        kbId,
        content: document.content,
        title: document.title,
        type: document.type,
        metadata: {
          ...metadata,
          source: 'ai_education_platform',
          timestamp: new Date()
        }
      });

      // 触发知识库更新
      await this.client.knowledgeBases.update(kbId);

      return result;
    } catch (error) {
      logger.error('添加文档失败:', error);
      throw error;
    }
  }

  private async initializeKBStructure(kbId) {
    // 实现知识库初始化逻辑
  }
}

export const maxkbIntegrationService = new MaxKBIntegrationService();
