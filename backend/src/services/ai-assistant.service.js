import { DeepSeekAPI } from '../utils/deepseek.js';
import { maxKBService } from './maxkb.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class AIAssistantService {
  constructor() {
    this.deepseek = DeepSeekAPI;
    this.maxkb = maxKBService;
    this.assistantTypes = {
      teacher: {
        role: 'expert_teacher',
        style: 'professional',
        capabilities: ['lesson_planning', 'content_creation', 'evaluation']
      },
      student: {
        role: 'learning_guide',
        style: 'encouraging',
        capabilities: ['problem_solving', 'concept_explanation', 'study_planning']
      },
      parent: {
        role: 'education_consultant',
        style: 'friendly',
        capabilities: ['progress_analysis', 'guidance', 'communication']
      }
    };
  }

  async getAssistance(params) {
    const { userId, type, query, context } = params;

    try {
      // 获取用户上下文
      const userContext = await this.getUserContext(userId);
      
      // 构建提示词
      const prompt = this.buildPrompt({
        type,
        query,
        context,
        userContext
      });

      // 生成回答
      const response = await this.deepseek.generate({
        prompt,
        temperature: 0.7,
        max_tokens: 1000,
        stop: ['用户:', '助手:']
      });

      // 保存对话历史
      await this.saveConversation(userId, query, response);

      return response;
    } catch (error) {
      logger.error('AI助手服务失败:', error);
      throw error;
    }
  }

  async createPersonalizedAssistant(userId, type) {
    try {
      const assistant = await maxKBService.createAgent({
        userId,
        ...this.assistantTypes[type],
        customization: {
          learningStyle: await this.analyzeLearningStyle(userId),
          interactionPreferences: await this.getInteractionPreferences(userId)
        }
      });

      return assistant;
    } catch (error) {
      logger.error('创建个性化助手失败:', error);
      throw error;
    }
  }

  async provideGuidance(userId, topic) {
    try {
      // 获取学习记录
      const learningContext = await this.getLearningContext(userId);

      // 生成学习建议
      const guidance = await this.deepseek.generate({
        prompt: this.buildGuidancePrompt(topic, learningContext),
        temperature: 0.5,
        max_tokens: 500
      });

      // 记录反馈
      await this.recordGuidanceFeedback(userId, topic, guidance);

      return {
        mainPoints: guidance.mainPoints,
        steps: guidance.steps,
        resources: guidance.recommendations
      };
    } catch (error) {
      logger.error('生成学习指导失败:', error);
      throw error;
    }
  }

  private buildPrompt(params) {
    const { type, query, context, userContext } = params;
    const assistant = this.assistantTypes[type];

    return `
角色: ${assistant.role}
风格: ${assistant.style}
背景: ${context || ''}
用户情况: ${JSON.stringify(userContext)}
用户问题: ${query}

请基于以上信息，以${assistant.style}的方式回答问题。注意：
1. 避免直接给出答案
2. 引导用户思考
3. 保持鼓励性
4. 强调学习过程
    `;
  }

  private async getUserContext(userId) {
    // 实现获取用户上下文的逻辑
  }

  private async saveConversation(userId, query, response) {
    // 实现保存对话历史的逻辑
  }
}

export const aiAssistantService = new AIAssistantService();
