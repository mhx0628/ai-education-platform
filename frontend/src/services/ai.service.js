import { api } from '@/utils/api';
import { AIModelConfig } from '@/config/ai.config';

class AIService {
  constructor() {
    this.modelConfig = AIModelConfig;
    this.contextWindow = [];
  }

  async generateTeachingPlan(params) {
    try {
      const response = await api.post('/ai/teaching/plan', {
        ...params,
        modelConfig: this.modelConfig.teaching
      });
      return response.data;
    } catch (error) {
      console.error('生成教案失败:', error);
      throw error;
    }
  }

  async analyzeStudentPerformance(data) {
    try {
      const response = await api.post('/ai/analysis/student', {
        data,
        modelConfig: this.modelConfig.analysis
      });
      return response.data;
    } catch (error) {
      console.error('分析学生表现失败:', error);
      throw error;
    }
  }

  async provideLearningGuidance(context) {
    try {
      // 更新上下文窗口
      this.updateContext(context);

      const response = await api.post('/ai/guidance', {
        context: this.contextWindow,
        modelConfig: this.modelConfig.guidance
      });

      return response.data;
    } catch (error) {
      console.error('生成学习指导失败:', error);
      throw error;
    }
  }

  async generateAIFeedback(submission) {
    try {
      const response = await api.post('/ai/feedback', {
        submission,
        modelConfig: this.modelConfig.feedback
      });
      return response.data;
    } catch (error) {
      console.error('生成AI反馈失败:', error);
      throw error;
    }
  }

  private updateContext(newContext) {
    // 维护固定大小的上下文窗口
    this.contextWindow.push(newContext);
    if (this.contextWindow.length > this.modelConfig.maxContextLength) {
      this.contextWindow.shift();
    }
  }

  // ... 其他AI服务方法 ...
}

export const aiService = new AIService();
