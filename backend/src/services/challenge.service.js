import { Challenge } from '../models/Challenge.js';
import { LearningRecord } from '../models/LearningRecord.js';
import { aiService } from './ai.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class ChallengeService {
  async getChallengesBySubject(params) {
    const { subject, level, page = 1, limit = 20 } = params;
    const query = { subject };
    
    if (level) {
      query.level = level;
    }

    const [challenges, total] = await Promise.all([
      Challenge.find(query)
        .select('-questions.answer')
        .sort({ level: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Challenge.countDocuments(query)
    ]);

    return {
      items: challenges,
      total,
      page,
      limit
    };
  }

  async startChallenge(challengeId, userId) {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      throw createError(404, '闯关不存在');
    }

    // 检查挑战次数限制
    const attempts = await LearningRecord.countDocuments({
      student: userId,
      'content.questionId': challengeId,
      recordType: 'challenge'
    });

    if (attempts >= challenge.requirements.maxAttempts) {
      throw createError(400, '已达到最大挑战次数');
    }

    // 创建学习记录
    const record = await LearningRecord.create({
      student: userId,
      recordType: 'challenge',
      subject: challenge.subject,
      content: {
        questionId: challengeId,
        score: 0
      },
      timestamps: {
        start: new Date()
      }
    });

    // 返回挑战内容（不包含答案）
    const challengeData = challenge.toObject();
    challengeData.questions = challengeData.questions.map(q => {
      const { answer, ...rest } = q;
      return rest;
    });

    return {
      record: record._id,
      challenge: challengeData
    };
  }

  async evaluateAnswer(recordId, answers) {
    const record = await LearningRecord.findById(recordId);
    if (!record) {
      throw createError(404, '记录不存在');
    }

    const challenge = await Challenge.findById(record.content.questionId);
    
    // 计算得分
    let totalScore = 0;
    const results = challenge.questions.map((question, index) => {
      const isCorrect = this.checkAnswer(question, answers[index]);
      if (isCorrect) {
        totalScore += question.points;
      }
      return {
        isCorrect,
        correctAnswer: question.answer,
        explanation: question.explanation
      };
    });

    // 更新统计数据
    await this.updateChallengeStats(challenge._id, totalScore);

    // 获取AI分析
    const aiAnalysis = await aiService.analyzeAnswers({
      subject: challenge.subject,
      level: challenge.level,
      questions: challenge.questions,
      answers,
      results
    });

    // 更新学习记录
    record.content.score = totalScore;
    record.content.aiAnalysis = aiAnalysis;
    record.timestamps.end = new Date();
    record.timestamps.duration = 
      (record.timestamps.end - record.timestamps.start) / 1000 / 60;
    await record.save();

    return {
      totalScore,
      results,
      analysis: aiAnalysis,
      passed: totalScore >= challenge.requirements.passScore
    };
  }

  async generateChallenge(params) {
    const { subject, grade, level, type } = params;

    try {
      // 使用AI生成挑战题目
      const questions = await aiService.generateQuestions({
        subject,
        grade,
        level,
        type,
        count: 10,
        includeHints: true
      });

      const challenge = new Challenge({
        subject,
        grade,
        level,
        type,
        questions,
        requirements: {
          timeLimit: 30,
          passScore: 60,
          maxAttempts: 3
        }
      });

      await challenge.save();
      return challenge;
    } catch (error) {
      logger.error('生成挑战失败:', error);
      throw error;
    }
  }

  async evaluateSubmission(userId, challengeId, answers) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw createError(404, '挑战不存在');
      }

      // AI评估答案
      const evaluation = await aiService.evaluateAnswers({
        questions: challenge.questions,
        answers,
        subject: challenge.subject,
        grade: challenge.grade
      });

      // 生成学习建议
      const feedback = await aiService.generateLearningAdvice({
        evaluation,
        subject: challenge.subject,
        style: 'constructive'
      });

      // 更新挑战记录
      await this.updateChallengeRecord(userId, challengeId, evaluation);

      return {
        score: evaluation.score,
        feedback,
        analysis: evaluation.analysis,
        nextSteps: evaluation.recommendations
      };
    } catch (error) {
      logger.error('评估提交失败:', error);
      throw error;
    }
  }

  async getPersonalizedHints(userId, challengeId, questionIndex) {
    try {
      const challenge = await Challenge.findById(challengeId);
      const question = challenge.questions[questionIndex];

      if (!question) {
        throw createError(404, '题目不存在');
      }

      // 根据学生特点生成个性化提示
      const hint = await aiService.generateHint({
        question,
        subject: challenge.subject,
        studentId: userId,
        style: 'guiding',
        detail: 'moderate'
      });

      return hint;
    } catch (error) {
      logger.error('生成提示失败:', error);
      throw error;
    }
  }

  private checkAnswer(question, answer) {
    // 根据题型判断答案是否正确
    switch (question.type) {
      case 'choice':
        return answer === question.answer;
      case 'fill':
        return answer.toLowerCase() === question.answer.toLowerCase();
      case 'short_answer':
        // 使用AI评估简答题
        return aiService.evaluateShortAnswer(question.answer, answer);
      default:
        return false;
    }
  }

  private async updateChallengeStats(challengeId, score) {
    const challenge = await Challenge.findById(challengeId);
    challenge.stats.totalAttempts += 1;
    challenge.stats.averageScore = 
      (challenge.stats.averageScore * (challenge.stats.totalAttempts - 1) + score) 
      / challenge.stats.totalAttempts;
    challenge.stats.successRate = 
      (score >= challenge.requirements.passScore ? 1 : 0 
        + challenge.stats.successRate * (challenge.stats.totalAttempts - 1))
      / challenge.stats.totalAttempts;
    await challenge.save();
  }

  private async updateChallengeRecord(userId, challengeId, evaluation) {
    try {
      await LearningRecord.findOneAndUpdate(
        { userId, challengeId },
        {
          $push: {
            attempts: {
              timestamp: new Date(),
              score: evaluation.score,
              analysis: evaluation.analysis
            }
          }
        },
        { upsert: true }
      );
    } catch (error) {
      logger.error('更新挑战记录失败:', error);
      throw error;
    }
  }
}

export const challengeService = new ChallengeService();
