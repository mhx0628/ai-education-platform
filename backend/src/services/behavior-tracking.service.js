import { UserBehavior } from '../models/UserBehavior.js';
import { aiService } from './ai.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class BehaviorTrackingService {
  async trackBehavior(userId, behaviorData) {
    try {
      const session = await UserBehavior.findOne({ 
        userId,
        sessionId: behaviorData.sessionId
      });

      if (session) {
        // 更新现有会话
        await UserBehavior.updateOne(
          { _id: session._id },
          { 
            $push: { behaviors: behaviorData },
            $set: { updatedAt: new Date() }
          }
        );
      } else {
        // 创建新会话
        await UserBehavior.create({
          userId,
          sessionId: behaviorData.sessionId,
          behaviors: [behaviorData]
        });
      }

      // 实时分析行为
      await this.analyzeUserBehavior(userId, behaviorData);

    } catch (error) {
      logger.error('行为跟踪失败:', error);
      throw error;
    }
  }

  async analyzeUserBehavior(userId, behavior) {
    try {
      // AI分析用户行为
      const analysis = await aiService.analyzeBehavior({
        userId,
        behavior,
        includeRecommendations: true
      });

      // 更新用户画像
      await this.updateUserProfile(userId, analysis);

      return analysis;
    } catch (error) {
      logger.error('行为分析失败:', error);
      // 不抛出错误，避免影响主流程
      return null;
    }
  }

  private async updateUserProfile(userId, analysis) {
    // 实现用户画像更新逻辑
  }
}

export const behaviorTrackingService = new BehaviorTrackingService();
