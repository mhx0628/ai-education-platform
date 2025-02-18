import { DeepSeekAPI } from '../utils/deepseek.js';
import { maxKBService } from './maxkb.service.js';
import { cacheService } from '../middlewares/cache.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class AIService {
  constructor() {
    this.deepseek = new DeepSeekAPI();
    this.maxkb = maxKBService;
  }

  async enhanceCourseContent(content) {
    try {
      // 使用本地知识库补充内容
      const localContext = await this.maxkb.searchRelevantContent(content);
      
      // 调用AI模型优化内容
      const enhanced = await this.deepseek.generate({
        prompt: `请基于以下内容和本地知识优化课程：\n原始内容：${content}\n本地知识：${localContext}`,
        model: 'deepseek-r1',
        temperature: 0.7,
        max_tokens: 2000
      });

      return enhanced.data.choices[0].message.content;
    } catch (err) {
      throw createError(500, 'AI服务异常: ' + err.message);
    }
  }

  async evaluateWork(content) {
    try {
      const evaluation = await this.deepseek.generate({
        prompt: `请评估以下作品：${JSON.stringify(content)}`,
        model: 'deepseek-r1',
        temperature: 0.7,
        max_tokens: 2000
      });

      return {
        score: this.calculateScore(evaluation.data.choices[0].message.content),
        feedback: evaluation.data.choices[0].message.content
      };
    } catch (err) {
      throw createError(500, 'AI评估服务异常: ' + err.message);
    }
  }

  async generateLessonPlan(params) {
    try {
      const prompt = this.buildLessonPlanPrompt(params);
      const response = await this.deepseek.generate({
        prompt,
        model: 'deepseek-r1',
        temperature: 0.7,
        max_tokens: 2000
      });

      const result = this.parseLessonPlan(response);
      
      // 内容审核
      await this.moderateContent(result);
      
      return result;
    } catch (error) {
      logger.error('AI生成教案失败:', error);
      throw createError(500, 'AI生成失败');
    }
  }

  async analyzeQuestion(question, context) {
    try {
      const analysis = await this.maxkb.collaborativeTask(
        {
          type: 'question_analysis',
          data: {
            question,
            context,
            requirements: ['key_points', 'difficulty', 'hints']
          }
        },
        ['TeachingAssistant']
      );

      return analysis;
    } catch (error) {
      logger.error('AI分析问题失败:', error);
      throw createError(500, 'AI分析失败');
    }
  }

  async processSchoolData(schoolId, dataType) {
    try {
      const cacheKey = `school:${schoolId}:${dataType}`;
      let result = await cacheService.get(cacheKey);

      if (!result) {
        result = await this.maxkb.collaborativeTask(
          {
            type: 'school_analysis',
            data: {
              schoolId,
              dataType,
              timeRange: '7d'
            }
          },
          ['CampusAnalyst', 'SafetyGuardian']
        );

        await cacheService.set(cacheKey, result, 3600);
      }

      return result;
    } catch (error) {
      logger.error('AI处理校园数据失败:', error);
      throw createError(500, 'AI分析失败');
    }
  }

  private buildLessonPlanPrompt(params) {
    const { subject, grade, unit, objectives } = params;
    return `作为一名经验丰富的${subject}老师，请为${grade}年级的'${unit}'单元设计一份教案。
教学目标：${objectives}
要求：
1. 注重学生核心素养培养
2. 采用项目式和探究式学习方法
3. 设计分组活动和互动环节
4. 适当融入AI工具应用`;
  }

  private parseLessonPlan(response) {
    // 解析和格式化AI响应
    return {
      outline: response.outline,
      activities: response.activities,
      resources: response.resources,
      evaluation: response.evaluation
    };
  }

  private async moderateContent(content) {
    // 内容审核实现
  }

  private calculateScore(feedback) {
    // 基于反馈内容计算分数的逻辑
    // ...
    return 85; // 示例分数
  }
}

export const aiService = new AIService();
