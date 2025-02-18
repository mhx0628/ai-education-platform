import { maxKBService } from './maxkb.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class KnowledgeService {
  async addDocument(orgId, document) {
    try {
      // 内容审核
      await this.moderateContent(document.content);

      // 添加到知识库
      const result = await maxKBService.insert(`org_${orgId}`, {
        ...document,
        createTime: new Date()
      });

      // 更新向量索引
      await this.updateVectorIndex(orgId);

      return result;
    } catch (error) {
      logger.error('文档添加失败:', error);
      throw createError(500, '知识库更新失败');
    }
  }

  async searchKnowledge(orgId, query, options = {}) {
    try {
      const { type, department, limit = 10 } = options;

      // 构建搜索条件
      const searchParams = {
        collection: `org_${orgId}`,
        query: query,
        filter: {
          ...(type && { type }),
          ...(department && { department })
        },
        limit
      };

      // 执行语义搜索
      const results = await maxKBService.semanticSearch(searchParams);

      return this.formatSearchResults(results);
    } catch (error) {
      logger.error('知识搜索失败:', error);
      throw createError(500, '搜索失败');
    }
  }

  async syncKnowledge(sourceOrgId, targetOrgId, options = {}) {
    try {
      const { types = [], departments = [] } = options;

      // 构建同步过滤条件
      const filter = {
        ...(types.length && { type: { $in: types } }),
        ...(departments.length && { department: { $in: departments } })
      };

      // 获取源组织知识
      const documents = await maxKBService.find(`org_${sourceOrgId}`, filter);

      // 同步到目标组织
      await maxKBService.batchInsert(`org_${targetOrgId}`, documents);

      return { 
        syncedCount: documents.length,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('知识同步失败:', error);
      throw createError(500, '同步失败');
    }
  }

  private async moderateContent(content) {
    // 实现内容审核逻辑
  }

  private async updateVectorIndex(orgId) {
    // 更新向量索引实现
  }

  private formatSearchResults(results) {
    return results.map(result => ({
      title: result.title,
      content: result.content,
      relevance: result.score,
      metadata: {
        type: result.type,
        department: result.department,
        createTime: result.createTime
      }
    }));
  }
}

export const knowledgeService = new KnowledgeService();
