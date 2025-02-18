import { aiService } from '../services/ai.service.js';
import { maxKBService } from '../services/maxkb.service.js';
import { createError } from '../utils/error.js';

export const aiController = {
  async chatWithAI(req, res, next) {
    try {
      const { message, context, agentId } = req.body;
      const userId = req.user.id;

      // 获取用户上下文
      const userContext = await maxKBService.getUserContext(userId);
      
      const response = await aiService.chat({
        message,
        context: [...(context || []), ...userContext],
        agentId,
        userId
      });

      res.json(response);
    } catch (err) {
      next(err);
    }
  },

  async generateLessonPlan(req, res, next) {
    try {
      const { subject, grade, topic, requirements } = req.body;
      const teacherId = req.user.id;

      // 获取教学资源和历史教案
      const resources = await maxKBService.searchRelevantContent(topic, {
        filters: { type: 'teaching_material' }
      });

      const lessonPlan = await aiService.generateLessonPlan({
        subject,
        grade,
        topic,
        requirements,
        resources,
        teacherId
      });

      res.json(lessonPlan);
    } catch (err) {
      next(err);
    }
  },

  async analyzeWork(req, res, next) {
    try {
      const { workId, type } = req.params;
      const userId = req.user.id;

      const work = await getWorkById(workId);
      if (!work) {
        return next(createError(404, '作品不存在'));
      }

      // 根据作品类型选择合适的AI模型进行分析
      const analysis = await aiService.analyzeWork(work, type);

      // 保存分析结果
      await saveWorkAnalysis(workId, analysis);

      res.json(analysis);
    } catch (err) {
      next(err);
    }
  },

  async createAgent(req, res, next) {
    try {
      const { name, type, capabilities, knowledgeBase } = req.body;
      
      // 验证必要参数
      if (!name || !type || !capabilities) {
        return next(createError(400, '缺少必要参数'));
      }

      // 创建智能体
      const agent = await maxKBService.createAgents([{
        name,
        type,
        capabilities,
        knowledgeBase,
        parameters: {
          temperature: 0.7,
          maxTokens: 2000,
          topP: 0.95
        }
      }]);

      res.status(201).json(agent[0]);
    } catch (err) {
      next(err);
    }
  },

  async collaborateWithAgents(req, res, next) {
    try {
      const { task, agentIds } = req.body;
      
      if (!task || !agentIds || !Array.isArray(agentIds)) {
        return next(createError(400, '无效的请求参数'));
      }

      const result = await maxKBService.collaborativeTask(task, agentIds);
      
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async generateResource(req, res, next) {
    try {
      const { type, params } = req.body;
      const userId = req.user.id;

      let resource;
      switch (type) {
        case 'quiz':
          resource = await aiService.generateQuiz(params);
          break;
        case 'exercise':
          resource = await aiService.generateExercise(params);
          break;
        case 'material':
          resource = await aiService.generateTeachingMaterial(params);
          break;
        default:
          return next(createError(400, '不支持的资源类型'));
      }

      // 保存到知识库
      await maxKBService.addDocument({
        content: resource,
        metadata: {
          creator: userId,
          type,
          ...params
        }
      });

      res.json(resource);
    } catch (err) {
      next(err);
    }
  }
};

// 辅助函数
async function getWorkById(workId) {
  // 实现获取作品的逻辑
  return null;
}

async function saveWorkAnalysis(workId, analysis) {
  // 实现保存分析结果的逻辑
}
