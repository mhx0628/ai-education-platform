import { MaxKB } from '@maxkb/node';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class MaxKBIntegrationService {
  constructor() {
    this.maxkb = null;
  }

  async initialize() {
    try {
      // 扩展MaxKB的认证机制，使用平台的JWT认证
      const customAuthProvider = {
        authenticate: async (token) => {
          // 验证平台JWT token
          const decoded = await this.verifyPlatformToken(token);
          return {
            userId: decoded.id,
            organizationId: decoded.organizationId
          };
        }
      };

      this.maxkb = new MaxKB({
        baseUrl: process.env.MAXKB_URL,
        authProvider: customAuthProvider,
        syncInterval: 30000, // 30秒同步一次
      });

      await this.maxkb.connect();
      logger.info('MaxKB集成服务初始化成功');
    } catch (error) {
      logger.error('MaxKB集成服务初始化失败:', error);
      throw error;
    }
  }

  async createUserKnowledgeBase(userId, organizationId) {
    try {
      const kbConfig = {
        name: `kb_${organizationId}_${userId}`,
        description: '个人知识库',
        embedModel: 'deepseek-base',
        accessControl: {
          owner: userId,
          organization: organizationId,
          permissions: ['read', 'write']
        }
      };

      return await this.maxkb.createKnowledgeBase(kbConfig);
    } catch (error) {
      logger.error('创建用户知识库失败:', error);
      throw error;
    }
  }

  // ... 其他集成方法
}

export const maxkbService = new MaxKBIntegrationService();
