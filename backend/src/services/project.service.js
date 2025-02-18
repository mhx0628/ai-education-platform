import { Project } from '../models/Project.js';
import { aiService } from './ai.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class ProjectService {
  async createProject(data, creatorId) {
    try {
      // 使用AI优化项目设计
      const enhancedProject = await aiService.enhanceProjectDesign({
        ...data,
        type: 'educational',
        objectives: data.objectives,
        skillsFocus: data.skillsFocus
      });

      const project = new Project({
        ...enhancedProject,
        creator: creatorId,
        status: 'planning',
        progress: 0,
        members: [{ user: creatorId, role: 'leader' }]
      });

      await project.save();
      return project;
    } catch (error) {
      logger.error('创建项目失败:', error);
      throw error;
    }
  }

  async generateProjectPlan(projectId) {
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        throw createError(404, '项目不存在');
      }

      // 生成项目计划
      const plan = await aiService.generateProjectPlan({
        project,
        includeTimeline: true,
        includeMilestones: true,
        includeRiskAnalysis: true
      });

      // 更新项目计划
      project.plan = plan;
      await project.save();

      return plan;
    } catch (error) {
      logger.error('生成项目计划失败:', error);
      throw error;
    }
  }

  async evaluateProject(projectId) {
    try {
      const project = await Project.findById(projectId)
        .populate('submissions')
        .populate('members.user');

      // AI评估项目
      const evaluation = await aiService.evaluateProject({
        project,
        criteria: [
          'completion',
          'innovation',
          'teamwork',
          'impact'
        ]
      });

      // 更新项目评估
      project.evaluation = evaluation;
      await project.save();

      return evaluation;
    } catch (error) {
      logger.error('项目评估失败:', error);
      throw error;
    }
  }

  async generateProjectReport(projectId) {
    try {
      const project = await Project.findById(projectId)
        .populate('activities')
        .populate('evaluation');

      // 生成项目报告
      const report = await aiService.generateProjectReport({
        project,
        format: 'detailed',
        includeAnalytics: true,
        includeLearningOutcomes: true
      });

      return report;
    } catch (error) {
      logger.error('生成项目报告失败:', error);
      throw error;
    }
  }

  private async validateProjectData(data) {
    // 实现项目数据验证逻辑
  }
}

export const projectService = new ProjectService();
