import { MaxKB } from '@maxkb/node';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class MaxKBService {
  constructor() {
    this.client = new MaxKB({
      apiKey: process.env.MAXKB_API_KEY,
      endpoint: process.env.MAXKB_ENDPOINT
    });
  }

  async createCollection(params) {
    try {
      const collection = await this.client.collections.create({
        name: params.name,
        description: params.description,
        schema: params.schema
      });

      logger.info(`创建知识库集合成功: ${params.name}`);
      return collection;
    } catch (error) {
      logger.error('创建知识库集合失败:', error);
      throw createError(500, '知识库创建失败');
    }
  }

  async createAgents(agentConfigs) {
    try {
      const agents = await Promise.all(
        agentConfigs.map(config => 
          this.client.agents.create({
            ...config,
            settings: {
              model: 'deepseek-r1',
              temperature: 0.7,
              ...config.settings
            }
          })
        )
      );

      logger.info(`创建智能体成功: ${agents.length}个`);
      return agents;
    } catch (error) {
      logger.error('创建智能体失败:', error);
      throw createError(500, '智能体创建失败');
    }
  }

  async collaborativeTask(task, agentIds) {
    try {
      const result = await this.client.tasks.create({
        agents: agentIds,
        input: task,
        settings: {
          maxSteps: 10,
          timeout: 30000
        }
      });

      return result.output;
    } catch (error) {
      logger.error('智能体协作任务失败:', error);
      throw createError(500, '智能体任务执行失败');
    }
  }

  async batchInsert(collectionName, documents) {
    try {
      const result = await this.client.documents.batchInsert(
        collectionName,
        documents
      );

      logger.info(`批量插入文档成功: ${documents.length}条`);
      return result;
    } catch (error) {
      logger.error('批量插入文档失败:', error);
      throw createError(500, '文档批量插入失败');
    }
  }

  async semanticSearch(params) {
    try {
      const { collection, query, filter, limit } = params;
      const results = await this.client.search.semantic({
        collection,
        query,
        filter,
        limit,
        settings: {
          minRelevance: 0.7
        }
      });

      return results;
    } catch (error) {
      logger.error('语义搜索失败:', error);
      throw createError(500, '搜索服务异常');
    }
  }
}

export const maxKBService = new MaxKBService();
