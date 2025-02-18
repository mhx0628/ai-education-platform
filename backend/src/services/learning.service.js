import { Course } from '../models/Course.js';
import { Challenge } from '../models/Challenge.js';
import { LearningRecord } from '../models/LearningRecord.js';
import { aiService } from './ai.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class LearningService {
  // 获取闯关列表
  async getSubjectChallenges(subject, grade, level) {
    try {
      const challenges = await Challenge.find({
        subject,
        grade,
        level: level || { $lte: 20 }
      })
      .select('-questions.answer')
      .sort({ level: 1 });

      return challenges;
    } catch (error) {
      logger.error('获取闯关列表失败:', error);
      throw error;
    }
  }

  // 学习课程相关
  async getRecommendedCourses(userId) {
    try {
      // 获取用户学习记录和偏好
      const records = await LearningRecord.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20);

      // 使用AI分析用户学习特点
      const userProfile = await aiService.analyzeUserLearning(records);

      // 基于分析结果推荐课程
      const courses = await Course.find({
        type: { $in: userProfile.interests },
        level: { $in: userProfile.recommendedLevels }
      })
      .limit(10)
      .populate('instructor', 'name avatar');

      return courses;
    } catch (error) {
      logger.error('获取推荐课程失败:', error);
      throw error;
    }
  }

  // 记录学习进度
  async updateLearningProgress(userId, courseId, data) {
    try {
      await LearningRecord.findOneAndUpdate(
        { userId, courseId },
        {
          $set: {
            progress: data.progress,
            lastPosition: data.position,
            timeSpent: data.timeSpent
          },
          $push: {
            activities: {
              type: data.activityType,
              timestamp: new Date(),
              details: data.details
            }
          }
        },
        { upsert: true }
      );
    } catch (error) {
      logger.error('更新学习进度失败:', error);
      throw error;
    }
  }

  // AI辅助学习
  async getAIAssistance(params) {
    const { userId, content, type, context } = params;

    try {
      // 获取用户学习记录
      const learningContext = await this.getLearningContext(userId);

      // 生成AI辅助响应
      const assistance = await aiService.generateLearningAssistance({
        content,
        type,
        context,
        learningContext,
        style: 'guiding' // 引导式而非直接给答案
      });

      return assistance;
    } catch (error) {
      logger.error('获取AI辅助失败:', error);
      throw error;
    }
  }

  // 生成学习报告
  async generateLearningReport(userId, period = 'monthly') {
    try {
      // 收集学习数据
      const data = await this.collectLearningData(userId, period);

      // 生成综合评估
      const evaluation = await aiService.evaluateComprehensivePerformance({
        academic: data.academic,
        activities: data.activities,
        social: data.social,
        creativity: data.creativity
      });

      // 生成成长报告
      return await aiService.generateGrowthReport({
        evaluation,
        suggestions: true,
        format: 'narrative'
      });
    } catch (error) {
      logger.error('生成学习报告失败:', error);
      throw error;
    }
  }

  private async getLearningContext(userId) {
    // 实现获取用户学习上下文的逻辑
  }

  private async collectLearningData(userId, period) {
    // 实现收集学习数据的逻辑
  }
}

export const learningService = new LearningService();
