import { maxKBService } from './maxkb.service.js';
import { createError } from '../utils/error.js';

class AssistantService {
  async createTeachingAssistant(teacherId) {
    try {
      const assistant = await maxKBService.createAgents([{
        name: 'TeachingAssistant',
        type: 'education',
        description: '个性化教学助手',
        capabilities: [
          'lesson_planning',
          'homework_review',
          'qa_support',
          'teaching_strategy'
        ],
        knowledgeBase: [
          'teaching_methods',
          'subject_knowledge',
          'student_psychology'
        ],
        parameters: {
          teachingStyle: 'interactive',
          feedbackLevel: 'detailed',
          adaptiveLogic: true
        }
      }]);

      return assistant[0];
    } catch (err) {
      throw createError(500, '创建教学助手失败: ' + err.message);
    }
  }

  async createLearningCompanion(studentId) {
    try {
      const companion = await maxKBService.createAgents([{
        name: 'LearningCompanion',
        type: 'education',
        description: '个性化学习伴侣',
        capabilities: [
          'progress_tracking',
          'doubt_solving',
          'study_planning',
          'motivation_boost'
        ],
        knowledgeBase: [
          'learning_methods',
          'subject_materials',
          'study_skills'
        ],
        parameters: {
          interactionStyle: 'friendly',
          encouragementLevel: 'high',
          adaptiveLearning: true
        }
      }]);

      return companion[0];
    } catch (err) {
      throw createError(500, '创建学习伴侣失败: ' + err.message);
    }
  }

  async getTeachingRecommendations(context) {
    try {
      return await maxKBService.collaborativeTask(
        {
          type: 'teaching_recommendations',
          context: context,
          requirements: {
            focus: ['strategy', 'resources', 'activities'],
            adaptionLevel: 'personalized'
          }
        },
        ['TeachingAssistant']
      );
    } catch (err) {
      throw createError(500, '获取教学建议失败: ' + err.message);
    }
  }
}

export const assistantService = new AssistantService();
