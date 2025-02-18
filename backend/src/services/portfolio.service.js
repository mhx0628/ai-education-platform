import { GrowthPortfolio } from '../models/GrowthPortfolio.js';
import { LearningRecord } from '../models/LearningRecord.js';
import { aiService } from './ai.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class PortfolioService {
  async generatePortfolio(studentId, period = 'semester') {
    try {
      // 收集学习数据
      const data = await this.collectPortfolioData(studentId, period);

      // 生成核心素养评估
      const competencyAssessment = await aiService.assessCompetencies({
        academicData: data.academic,
        behavioralData: data.behavioral,
        creativeData: data.creative,
        socialData: data.social
      });

      // 生成个性化报告
      const report = await this.generateGrowthReport(studentId, {
        assessments: competencyAssessment,
        period,
        includeEvidence: true
      });

      // 更新成长档案
      await this.updatePortfolio(studentId, {
        period,
        report,
        assessments: competencyAssessment
      });

      return report;
    } catch (error) {
      logger.error('生成成长档案失败:', error);
      throw error;
    }
  }

  async addPortfolioEntry(studentId, entry) {
    try {
      const portfolio = await GrowthPortfolio.findOne({ studentId });
      
      // 内容审核
      const moderationResult = await aiService.moderateContent(entry.content);
      if (!moderationResult.isApproved) {
        throw createError(400, '内容不合规');
      }

      // 添加条目
      portfolio.entries.push({
        ...entry,
        timestamp: new Date(),
        aiAnalysis: await this.analyzeEntry(entry)
      });

      await portfolio.save();
      return portfolio;
    } catch (error) {
      logger.error('添加档案条目失败:', error);
      throw error;
    }
  }

  async generateProgressReport(studentId, timeRange) {
    try {
      // 收集进展数据
      const progressData = await this.collectProgressData(studentId, timeRange);

      // 生成进展报告
      const report = await aiService.generateProgressReport({
        data: progressData,
        style: 'narrative',
        focusAreas: [
          'academic',
          'competencies',
          'social',
          'creative',
          'personal'
        ]
      });

      // 添加AI建议
      const recommendations = await aiService.generateRecommendations({
        progressReport: report,
        studentHistory: progressData.history
      });

      return {
        report,
        recommendations,
        evidences: progressData.evidences,
        milestones: progressData.milestones
      };
    } catch (error) {
      logger.error('生成进展报告失败:', error);
      throw error;
    }
  }

  private async collectPortfolioData(studentId, period) {
    // 实现数据收集逻辑
  }

  private async generateGrowthReport(studentId, params) {
    // 实现报告生成逻辑
  }

  private async analyzeEntry(entry) {
    // 实现条目分析逻辑
  }
}

export const portfolioService = new PortfolioService();
