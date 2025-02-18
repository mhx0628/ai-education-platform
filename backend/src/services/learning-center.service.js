import { LearningRecord } from '../models/LearningRecord.js';
import { Challenge } from '../models/Challenge.js';
import { Course } from '../models/Course.js';
import { aiService } from './ai.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class LearningCenterService {
  async startChallenge(userId, subjectId, level) {
    try {
      // 获取闯关题目
      const challenge = await Challenge.findOne({
        subject: subjectId,
        level,
        status: 'active'
      });

      if (!challenge) {
        throw createError(404, '未找到合适的闯关题目');
      }

      // 创建学习记录
      const record = await LearningRecord.create({
        userId,
        type: 'challenge',
        challengeId: challenge._id,
        startTime: new Date(),
        status: 'in_progress'
      });

      // 处理题目内容（移除答案等敏感信息）
      const processedChallenge = this.processChallenge(challenge);

      return {
        recordId: record._id,
        challenge: processedChallenge
      };
    } catch (error) {
      logger.error('开始闯关失败:', error);
      throw error;
    }
  }

  async getAIGuidance(userId, questionId) {
    try {
      // 获取用户历史答题数据
      const history = await this.getUserAnswerHistory(userId, questionId);

      // 生成个性化提示
      const guidance = await aiService.generateLearningGuidance({
        questionId,
        history,
        style: 'socratic', // 采用苏格拉底式问答
        difficulty: history.averageDifficulty
      });

      return guidance;
    } catch (error) {
      logger.error('获取AI指导失败:', error);
      throw error;
    }
  }

  async recommendLearningPath(userId) {
    try {
      // 收集学习数据
      const learningData = await this.collectLearningData(userId);

      // 生成学习路径建议
      const recommendation = await aiService.generateLearningPath({
        userData: learningData,
        goals: learningData.goals,
        preferences: learningData.preferences,
        adaptiveLevel: true
      });

      return recommendation;
    } catch (error) {
      logger.error('生成学习路径建议失败:', error);
      throw error;
    }
  }

  async processAnswers(recordId, answers) {
    try {
      const record = await LearningRecord.findById(recordId);
      
      // 答案评估
      const evaluation = await aiService.evaluateAnswers({
        answers,
        challenge: record.challengeId,
        noDirectAnswer: true, // 不直接给出答案
        focusOnProcess: true  // 关注解题过程
      });

      // 更新学习记录
      record.answers = answers;
      record.evaluation = evaluation;
      record.endTime = new Date();
      await record.save();

      return {
        evaluation: this.processEvaluation(evaluation),
        suggestions: evaluation.suggestions,
        nextSteps: evaluation.nextSteps
      };
    } catch (error) {
      logger.error('处理答案失败:', error);
      throw error;
    }
  }

  private processChallenge(challenge) {
    // 处理题目内容，移除答案等信息
    const { questions, ...rest } = challenge.toObject();
    return {
      ...rest,
      questions: questions.map(q => {
        const { answer, explanation, ...questionRest } = q;
        return questionRest;
      })
    };
  }

  private async getUserAnswerHistory(userId, questionId) {
    // 实现获取用户答题历史的逻辑
  }

  private async collectLearningData(userId) {
    // 实现收集学习数据的逻辑
  }

  private processEvaluation(evaluation) {
    // 处理评估结果，确保不直接展示答案
    return {
      score: evaluation.score,
      feedback: evaluation.feedback,
      improvement: evaluation.improvement,
      thinkingProcess: evaluation.thinkingProcess
    };
  }
}

export const learningCenterService = new LearningCenterService();
