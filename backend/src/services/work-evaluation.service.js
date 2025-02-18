import { Work } from '../models/Work.js';
import { aiService } from './ai.service.js';
import { moderationService } from './moderation.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class WorkEvaluationService {
  async evaluateWork(work, evaluatorId) {
    try {
      // 作品审核
      const moderationResult = await moderationService.moderateContent({
        type: work.type,
        content: work.content
      });

      if (!moderationResult.isApproved) {
        throw createError(400, '作品内容不合规');
      }

      // AI评估维度
      const evaluation = await aiService.evaluateCreativeWork({
        type: work.type,
        content: work.content,
        criteria: {
          creativity: true,
          technique: true,
          presentation: true,
          impact: true
        }
      });

      // 生成评语和建议
      const feedback = await aiService.generateWorkFeedback({
        evaluation,
        style: 'encouraging',
        includeExamples: true,
        focusAreas: evaluation.weaknesses
      });

      return {
        scores: evaluation.scores,
        feedback,
        suggestions: evaluation.recommendations
      };
    } catch (error) {
      logger.error('作品评估失败:', error);
      throw error;
    }
  }

  async generateGrowthReport(userId, period = '30d') {
    try {
      const works = await Work.find({
        creator: userId,
        createdAt: { $gte: new Date(Date.now() - this.getPeriodMs(period)) }
      }).sort({ createdAt: 1 });

      // 分析创作成长轨迹
      const analysis = await aiService.analyzeCreativeGrowth({
        works,
        metrics: ['quality', 'complexity', 'originality'],
        period
      });

      return {
        growthCurve: analysis.growthCurve,
        keyMilestones: analysis.milestones,
        recommendations: analysis.recommendations
      };
    } catch (error) {
      logger.error('生成成长报告失败:', error);
      throw error;
    }
  }

  private getPeriodMs(period) {
    const periods = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000
    };
    return periods[period] || periods['30d'];
  }
}

export const workEvaluationService = new WorkEvaluationService();
