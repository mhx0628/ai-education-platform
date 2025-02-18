import { Resource } from '../models/Resource.js';
import { aiService } from './ai.service.js';
import { moderationService } from './moderation.service.js';
import { cacheService } from './cache.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class ResourceService {
  async createLearningResource(data, creatorId) {
    try {
      // 内容审核
      const moderationResult = await moderationService.moderateContent({
        type: data.type,
        content: data.content
      });

      if (!moderationResult.isApproved) {
        throw createError(400, `内容不合规: ${moderationResult.reason}`);
      }

      // AI增强内容
      const enhancedContent = await aiService.enhanceResource({
        content: data.content,
        type: data.type,
        subject: data.subject,
        grade: data.grade
      });

      const resource = new Resource({
        ...data,
        content: enhancedContent,
        creator: creatorId,
        status: 'pending'
      });

      await resource.save();
      return resource;
    } catch (error) {
      logger.error('创建学习资源失败:', error);
      throw error;
    }
  }

  async generateInteractiveContent(params) {
    const { type, subject, grade, objectives } = params;

    try {
      // 生成交互式内容
      const content = await aiService.generateInteractiveResource({
        type,
        subject,
        grade,
        objectives,
        includeQuizzes: true,
        includeExercises: true
      });

      // 缓存生成的内容
      await cacheService.set(
        `resource:interactive:${type}:${subject}:${grade}`,
        content,
        3600
      );

      return content;
    } catch (error) {
      logger.error('生成交互式内容失败:', error);
      throw error;
    }
  }

  async recommendResources(userId, params) {
    try {
      // 获取用户学习记录
      const learningHistory = await this.getLearningHistory(userId);

      // AI分析用户偏好
      const userPreferences = await aiService.analyzeUserPreferences(learningHistory);

      // 基于偏好推荐资源
      const recommendedResources = await Resource.find({
        subject: { $in: userPreferences.subjects },
        grade: { $in: userPreferences.grades },
        type: { $in: userPreferences.types },
        status: 'published'
      })
      .sort({ relevanceScore: -1 })
      .limit(10);

      return recommendedResources;
    } catch (error) {
      logger.error('资源推荐失败:', error);
      throw error;
    }
  }

  async searchResources(params) {
    const { keyword, subject, grade, type, page = 1, limit = 20 } = params;

    try {
      const query = {
        status: 'published'
      };

      if (keyword) {
        query.$text = { $search: keyword };
      }
      if (subject) query.subject = subject;
      if (grade) query.grade = grade;
      if (type) query.type = type;

      const [resources, total] = await Promise.all([
        Resource.find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ relevance: -1 }),
        Resource.countDocuments(query)
      ]);

      return {
        items: resources,
        total,
        page,
        limit
      };
    } catch (error) {
      logger.error('资源搜索失败:', error);
      throw error;
    }
  }

  async updateResourceStatus(resourceId, status, reviewer) {
    try {
      const resource = await Resource.findById(resourceId);
      if (!resource) {
        throw createError(404, '资源不存在');
      }

      resource.status = status;
      if (status === 'published') {
        resource.reviewedBy = reviewer;
        resource.publishedAt = new Date();
      }

      await resource.save();
      return resource;
    } catch (error) {
      logger.error('更新资源状态失败:', error);
      throw error;
    }
  }

  private async getLearningHistory(userId) {
    // 实现获取学习历史的逻辑
  }
}

export const resourceService = new ResourceService();
