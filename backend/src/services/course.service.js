import { Course } from '../models/Course.js';
import { LearningRecord } from '../models/LearningRecord.js';
import { aiService } from './ai.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class CourseService {
  async createCourse(data, creatorId) {
    try {
      // AI辅助优化课程内容
      const enhancedContent = await aiService.enhanceCourseContent({
        title: data.title,
        description: data.description,
        objectives: data.objectives,
        type: data.type
      });

      const course = new Course({
        ...data,
        content: enhancedContent,
        instructor: creatorId,
        stats: {
          enrollmentCount: 0,
          completionRate: 0,
          averageRating: 0
        }
      });

      await course.save();
      return course;
    } catch (error) {
      logger.error('创建课程失败:', error);
      throw error;
    }
  }

  async generateLearningPath(userId, courseId) {
    try {
      // 获取用户学习数据
      const learningRecords = await LearningRecord.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20);

      // 分析学习特点
      const learningProfile = await aiService.analyzeLearningStyle(learningRecords);

      // 生成个性化学习路径
      return await aiService.generatePersonalizedPath({
        courseId,
        learningProfile,
        adaptiveLevel: true,
        includeExercises: true
      });
    } catch (error) {
      logger.error('生成学习路径失败:', error);
      throw error;
    }
  }

  async evaluateProgress(userId, courseId) {
    try {
      const record = await LearningRecord.findOne({ userId, courseId });
      if (!record) {
        throw createError(404, '未找到学习记录');
      }

      // 分析学习效果
      const analysis = await aiService.analyzeProgress({
        learningData: record,
        type: 'comprehensive',
        generateRecommendations: true
      });

      return {
        progress: record.progress,
        analysis: analysis,
        nextSteps: analysis.recommendations
      };
    } catch (error) {
      logger.error('评估学习进度失败:', error);
      throw error;
    }
  }

  async provideLearningFeedback(params) {
    const { userId, courseId, data } = params;
    
    try {
      // 生成个性化反馈
      const feedback = await aiService.generateFeedback({
        learningData: data,
        style: 'encouraging',
        includeExamples: true,
        focusAreas: ['concept', 'practice', 'application']
      });

      // 更新学习记录
      await LearningRecord.findOneAndUpdate(
        { userId, courseId },
        {
          $push: {
            feedback: {
              content: feedback,
              timestamp: new Date()
            }
          }
        }
      );

      return feedback;
    } catch (error) {
      logger.error('生成学习反馈失败:', error);
      throw error;
    }
  }
}

export const courseService = new CourseService();
