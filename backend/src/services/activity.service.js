import { Activity } from '../models/Activity.js';
import { Submission } from '../models/Submission.js';
import { createError } from '../utils/error.js';
import { aiService } from './ai.service.js';
import { logger } from '../utils/logger.js';

class ActivityService {
  async createActivity(activityData, userId) {
    try {
      // 验证活动级别权限
      await this.validateActivityPermission(activityData.level, userId);

      const activity = new Activity({
        ...activityData,
        creator: userId
      });

      await activity.save();
      
      // 创建相关资源
      await this.initializeActivityResources(activity);

      return activity;
    } catch (error) {
      logger.error('创建活动失败:', error);
      throw error;
    }
  }

  async submitWork(submissionData, userId) {
    try {
      // 检查活动状态和提交时间
      const activity = await Activity.findById(submissionData.activityId);
      if (!this.canSubmit(activity)) {
        throw createError(400, '当前不在作品提交时间内');
      }

      // AI内容审核
      const aiReview = await this.reviewContent(submissionData.content);
      if (!aiReview.passed) {
        throw createError(400, '内容审核未通过: ' + aiReview.reason);
      }

      const submission = new Submission({
        ...submissionData,
        creator: userId
      });

      await submission.save();

      // 更新活动统计
      await Activity.updateOne(
        { _id: submissionData.activityId },
        { $inc: { 'stats.submissions': 1 } }
      );

      return submission;
    } catch (error) {
      logger.error('提交作品失败:', error);
      throw error;
    }
  }

  async voteForSubmission(submissionId, voteData, userId) {
    try {
      const submission = await Submission.findById(submissionId);
      const activity = await Activity.findById(submission.activityId);

      // 检查投票权限和时间
      if (!this.canVote(activity, userId)) {
        throw createError(400, '无投票权限或不在投票时间内');
      }

      // 更新作品评分
      await Submission.updateOne(
        { _id: submissionId },
        { 
          $push: { 'scores.publicVotes': { ...voteData, user: userId } },
          $inc: { 'stats.voteCount': 1 }
        }
      );

      // 更新活动统计
      await Activity.updateOne(
        { _id: submission.activityId },
        { $inc: { 'stats.votes': 1 } }
      );

      return { success: true };
    } catch (error) {
      logger.error('投票失败:', error);
      throw error;
    }
  }

  async getActivityResults(activityId) {
    try {
      const activity = await Activity.findById(activityId);
      const submissions = await Submission.find({ activityId })
        .sort({ 'stats.totalScore': -1 })
        .populate('creator', 'username profile');

      // 计算最终排名
      const results = await this.calculateFinalResults(activity, submissions);

      // AI生成活动总结报告
      const report = await aiService.generateActivityReport(activity, results);

      return {
        rankings: results,
        report,
        statistics: this.generateStatistics(submissions)
      };
    } catch (error) {
      logger.error('获取活动结果失败:', error);
      throw error;
    }
  }

  private async validateActivityPermission(level, userId) {
    // 实现权限验证逻辑
  }

  private async initializeActivityResources(activity) {
    // 初始化活动相关资源
  }

  private canSubmit(activity) {
    const now = new Date();
    return (
      activity.status === 'ongoing' &&
      now >= activity.timeline.submission.start &&
      now <= activity.timeline.submission.end
    );
  }

  private canVote(activity, userId) {
    // 实现投票权限检查
  }

  private async reviewContent(content) {
    // 实现AI内容审核逻辑
    return await aiService.reviewContent(content);
  }

  private async calculateFinalResults(activity, submissions) {
    // 实现最终结果计算逻辑
  }

  private generateStatistics(submissions) {
    // 生成统计数据
    return {
      totalSubmissions: submissions.length,
      averageScore: this.calculateAverageScore(submissions),
      categoryDistribution: this.calculateCategoryDistribution(submissions)
    };
  }
}

export const activityService = new ActivityService();
