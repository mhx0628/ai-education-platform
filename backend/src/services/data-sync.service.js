import { syncConfig } from '../config/sync.config.js';
import { maxKBService } from './maxkb.service.js';
import { cacheService } from '../middlewares/cache.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class DataSyncService {
  constructor() {
    this.syncQueues = {
      realtime: new Set(),
      normal: new Set(),
      batch: new Set()
    };

    this.syncIntervals = {};
    this.retryCount = new Map();
  }

  async startSync() {
    // 启动各类型数据同步任务
    Object.entries(syncConfig.intervals).forEach(([type, interval]) => {
      this.syncIntervals[type] = setInterval(() => {
        this.processSyncQueue(type);
      }, interval);
    });

    logger.info('数据同步服务已启动');
  }

  async addToSyncQueue(data, type = 'normal') {
    try {
      this.validateSyncData(data);
      
      // 添加到相应队列
      this.syncQueues[type].add({
        id: data.id,
        type: data.type,
        data: data,
        timestamp: Date.now()
      });

      // 实时数据立即同步
      if (type === 'realtime') {
        await this.syncToServer(data);
      }

      return true;
    } catch (error) {
      logger.error('添加同步任务失败:', error);
      throw error;
    }
  }

  async syncToMaxKB(data) {
    try {
      const maxkbData = this.transformDataForMaxKB(data);
      
      // 同步到MaxKB
      await maxKBService.updateKnowledgeBase({
        collectionName: data.type,
        document: maxkbData,
        userId: data.userId
      });

      return true;
    } catch (error) {
      logger.error('同步到MaxKB失败:', error);
      throw error;
    }
  }

  private async processSyncQueue(type) {
    const queue = this.syncQueues[type];
    
    for (const item of queue) {
      try {
        await this.syncToServer(item.data);
        queue.delete(item);
        this.retryCount.delete(item.id);
      } catch (error) {
        this.handleSyncError(item, error);
      }
    }
  }

  private handleSyncError(item, error) {
    const retryCount = this.retryCount.get(item.id) || 0;
    
    if (retryCount < syncConfig.errorHandling.maxRetries) {
      this.retryCount.set(item.id, retryCount + 1);
      // 延迟重试
      setTimeout(() => {
        this.addToSyncQueue(item.data, item.type);
      }, syncConfig.errorHandling.retryDelays[retryCount]);
    } else {
      logger.error(`数据同步失败，已达最大重试次数: ${item.id}`);
      // 转入失败队列
      this.moveToFailedQueue(item);
    }
  }

  private validateSyncData(data) {
    if (!data.id || !data.type) {
      throw createError(400, '无效的同步数据格式');
    }
  }

  private transformDataForMaxKB(data) {
    // 转换数据格式以适配MaxKB
    return {
      id: data.id,
      content: data.content,
      metadata: {
        type: data.type,
        timestamp: data.timestamp,
        user: data.userId
      }
    };
  }
}

export const dataSyncService = new DataSyncService();
