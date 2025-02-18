import mongoose from 'mongoose';
import { LearningRecord } from '../models/LearningRecord.js';
import { Activity } from '../models/Activity.js';
import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { aiService } from './ai.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';
import { UserBehavior } from '../models/UserBehavior.js';

class AnalyticsService {
  async generateReport(params) {
    const { scope, timeRange, metrics = ['learning', 'engagement', 'performance'] } = params;

    try {
      const data = await this.gatherAnalyticsData(scope, timeRange);
      const insights = await this.analyzeData(data, metrics);
      const visualizations = this.generateVisualizations(insights);
      
      return {
        metadata: {
          scope,
          timeRange,
          generatedAt: new Date()
        },
        insights,
        visualizations,
        recommendations: await this.generateRecommendations(insights)
      };
    } catch (error) {
      logger.error('生成分析报告失败:', error);
      throw error;
    }
  }

  async getPerformanceMetrics(params) {
    const { userId, type = 'student', period = '30d' } = params;

    try {
      const metrics = await this.calculateMetrics(userId, type, period);
      const trends = await this.analyzeTrends(metrics);
      const benchmarks = await this.getBenchmarks(type, period);

      return {
        metrics,
        trends,
        benchmarks,
        summary: this.generateSummary(metrics, trends, benchmarks)
      };
    } catch (error) {
      logger.error('获取表现指标失败:', error);
      throw error;
    }
  }

  async predictTrends(params) {
    const { dataPoints, targetMetric, horizon = 30 } = params;

    try {
      // 使用AI模型预测趋势
      const prediction = await aiService.predictTrend({
        historical: dataPoints,
        target: targetMetric,
        horizon
      });

      return {
        predictions: prediction.values,
        confidence: prediction.confidence,
        factors: prediction.influencingFactors
      };
    } catch (error) {
      logger.error('预测趋势失败:', error);
      throw error;
    }
  }

  async generateUserProfile(userId) {
    try {
      // 收集用户行为数据
      const behaviors = await UserBehavior.find({ userId })
        .sort({ 'behaviors.timestamp.start': -1 })
        .limit(1000);

      // 收集学习记录
      const learningRecords = await LearningRecord.find({ student: userId })
        .sort({ createdAt: -1 })
        .limit(100);

      // 生成用户画像
      const profile = await aiService.generateUserProfile({
        behaviors,
        learningRecords,
        analysisTypes: [
          'learning_style',
          'interest_areas',
          'strength_weakness',
          'growth_trajectory'
        ]
      });

      // 生成学习建议
      const recommendations = await aiService.generateRecommendations({
        profile,
        targetAreas: profile.weaknesses,
        context: 'personalized_learning'
      });

      return {
        profile,
        recommendations,
        lastUpdated: new Date()
      };

    } catch (error) {
      logger.error('生成用户画像失败:', error);
      throw error;
    }
  }

  async aggregateClassStats(classId) {
    try {
      const pipeline = [
        {
          $match: { classId }
        },
        {
          $group: {
            _id: '$subject',
            averageScore: { $avg: '$scores.value' },
            participationRate: { $avg: '$attendance' },
            aiUsage: { $sum: '$aiInteractions' }
          }
        }
      ];

      const stats = await LearningRecord.aggregate(pipeline);
      
      // AI分析班级整体情况
      const analysis = await aiService.analyzeClassPerformance({
        stats,
        includeRecommendations: true,
        compareWithHistory: true
      });

      return {
        stats,
        analysis,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('汇总班级统计失败:', error);
      throw error;
    }
  }

  async generateLearningReport(params) {
    const { userId, timeRange, type = 'comprehensive' } = params;
    
    try {
      // 收集学习数据
      const data = await this.collectLearningData(userId, timeRange);

      // 生成报告
      const report = await aiService.generateLearningReport({
        data,
        type,
        format: 'detailed',
        visualizations: true
      });

      // 添加AI建议
      const suggestions = await aiService.generateLearningAdvice({
        report,
        personalizedLevel: 'high'
      });

      return {
        report,
        suggestions,
        generatedAt: new Date()
      };
    } catch (error) {
      logger.error('生成学习报告失败:', error);
      throw error;
    }
  }

  async trackEngagement(params) {
    const { userId, activityType, data } = params;
    
    try {
      // 记录参与度数据
      await UserBehavior.updateOne(
        { userId },
        {
          $push: {
            behaviors: {
              type: activityType,
              details: data,
              timestamp: {
                start: new Date()
              }
            }
          }
        },
        { upsert: true }
      );

      // 实时分析参与度
      const analysis = await aiService.analyzeEngagement({
        userId,
        activityType,
        data
      });

      return analysis;
    } catch (error) {
      logger.error('跟踪参与度失败:', error);
      throw error;
    }
  }

  private async gatherAnalyticsData(scope, timeRange) {
    const queries = {
      learning: this.getLearningData(scope, timeRange),
      engagement: this.getEngagementData(scope, timeRange),
      performance: this.getPerformanceData(scope, timeRange)
    };

    return await Promise.all(Object.values(queries));
  }

  private async analyzeData(data, metrics) {
    const analysisPromises = metrics.map(metric => 
      this.analyzeMetric(data[metric])
    );

    return {
      metrics: await Promise.all(analysisPromises),
      correlations: this.findCorrelations(data),
      patterns: this.identifyPatterns(data)
    };
  }

  private generateVisualizations(insights) {
    return {
      charts: this.createCharts(insights),
      dashboards: this.createDashboards(insights),
      reports: this.createReports(insights)
    };
  }

  private async generateRecommendations(insights) {
    const prompt = `基于以下分析洞察生成教育改进建议：${JSON.stringify(insights)}`;
    const response = await aiService.generateRecommendations(prompt);
    return response.recommendations;
  }

  private async collectLearningData(userId, timeRange) {
    // 实现学习数据收集逻辑
  }
}

export const analyticsService = new AnalyticsService();
