import { Evaluation } from '../models/Evaluation.js';
import { LearningRecord } from '../models/LearningRecord.js';
import { aiService } from './ai.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class EvaluationService {
  async generateEvaluation(params) {
    try {
      const { studentId, type, period } = params;

      // 收集评估所需的数据
      const learningData = await this.collectLearningData(studentId, period);
      const activityData = await this.collectActivityData(studentId, period);
      const competencyData = await this.collectCompetencyData(studentId, period);

      // 使用AI分析数据
      const aiAnalysis = await aiService.analyzeStudentPerformance({
        learning: learningData,
        activity: activityData,
        competency: competencyData
      });

      // 生成评估报告
      const evaluation = new Evaluation({
        student: studentId,
        evaluator: 'system',
        type,
        period,
        academics: this.processAcademics(learningData, aiAnalysis),
        competencies: this.processCompetencies(competencyData, aiAnalysis),
        aiAnalysis: {
          strengths: aiAnalysis.strengths,
          weaknesses: aiAnalysis.weaknesses,
          recommendations: aiAnalysis.recommendations,
          growthTrajectory: this.calculateGrowthTrajectory(learningData),
          predictiveInsights: aiAnalysis.predictions
        }
      });

      await evaluation.save();
      return evaluation;
    } catch (error) {
      logger.error('生成评估报告失败:', error);
      throw createError(500, '评估生成失败');
    }
  }

  async updateEvaluation(evaluationId, updates) {
    try {
      const evaluation = await Evaluation.findById(evaluationId);
      if (!evaluation) {
        throw createError(404, '评估记录不存在');
      }

      // 更新评估内容
      Object.assign(evaluation, updates);
      await evaluation.save();

      return evaluation;
    } catch (error) {
      logger.error('更新评估报告失败:', error);
      throw error;
    }
  }

  private async collectLearningData(studentId, period) {
    return await LearningRecord.find({
      student: studentId,
      createdAt: this.getPeriodDateRange(period)
    }).sort({ createdAt: 1 });
  }

  private async collectActivityData(studentId, period) {
    // 实现活动数据收集逻辑
  }

  private async collectCompetencyData(studentId, period) {
    // 实现能力评估数据收集逻辑
  }

  private processAcademics(learningData, aiAnalysis) {
    // 处理学业表现数据
    return {
      subjects: this.calculateSubjectPerformance(learningData),
      averageScore: this.calculateAverageScore(learningData),
      overallRanking: aiAnalysis.ranking
    };
  }

  private processCompetencies(competencyData, aiAnalysis) {
    // 处理核心素养数据
    return {
      cognitive: this.evaluateCognitiveSkills(competencyData),
      social: this.evaluateSocialSkills(competencyData),
      personal: this.evaluatePersonalSkills(competencyData)
    };
  }

  private calculateGrowthTrajectory(data) {
    // 计算成长轨迹
    return {
      academic: this.calculateAcademicGrowth(data),
      competency: this.calculateCompetencyGrowth(data)
    };
  }

  private getPeriodDateRange(period) {
    // 根据评估周期计算日期范围
    const now = new Date();
    switch (period) {
      case 'daily':
        return { $gte: new Date(now.setHours(0, 0, 0, 0)) };
      case 'weekly':
        return { $gte: new Date(now.setDate(now.getDate() - 7)) };
      case 'monthly':
        return { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
      case 'semester':
        return { $gte: new Date(now.setMonth(now.getMonth() - 6)) };
      case 'yearly':
        return { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
      default:
        throw createError(400, '无效的评估周期');
    }
  }
}

export const evaluationService = new EvaluationService();
