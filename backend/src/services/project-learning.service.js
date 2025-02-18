import { maxKBService } from './maxkb.service.js';
import { createError } from '../utils/error.js';

class ProjectLearningService {
  async generateProject(params) {
    try {
      const { subject, grade, duration, theme } = params;
      
      // 使用AI生成项目方案
      const project = await maxKBService.collaborativeTask(
        {
          type: 'project_generation',
          requirements: {
            subject,
            grade,
            duration,
            theme,
            components: ['objectives', 'activities', 'resources', 'evaluation']
          }
        },
        ['TeachingAssistant', 'CampusAnalyst']
      );

      return this.enrichProjectPlan(project);
    } catch (err) {
      throw createError(500, '项目生成失败: ' + err.message);
    }
  }

  async createProjectGroup(projectId, students) {
    try {
      // 基于学生特征进行分组
      const groupingStrategy = await this.analyzeStudentCharacteristics(students);
      
      return {
        groups: this.formGroups(students, groupingStrategy),
        roles: await this.assignGroupRoles(students),
        timeline: await this.createProjectTimeline(projectId)
      };
    } catch (err) {
      throw createError(500, '项目分组失败: ' + err.message);
    }
  }

  async monitorProjectProgress(projectId) {
    try {
      const progress = {
        milestones: await this.checkMilestones(projectId),
        teamwork: await this.evaluateTeamwork(projectId),
        individual: await this.assessIndividualContribution(projectId)
      };

      // AI分析项目进展
      const analysis = await maxKBService.collaborativeTask(
        {
          type: 'progress_analysis',
          data: progress,
          requirements: {
            focus: ['collaboration', 'innovation', 'problemSolving']
          }
        },
        ['TeachingAssistant']
      );

      return {
        progress,
        recommendations: analysis.recommendations,
        alerts: analysis.alerts
      };
    } catch (err) {
      throw createError(500, '项目监控失败: ' + err.message);
    }
  }

  async evaluateProject(projectId) {
    try {
      const evaluationData = {
        process: await this.evaluateProcess(projectId),
        outcome: await this.evaluateOutcome(projectId),
        impact: await this.evaluateImpact(projectId)
      };

      // 生成评估报告
      const report = await maxKBService.collaborativeTask(
        {
          type: 'project_evaluation',
          data: evaluationData,
          requirements: {
            aspects: ['learning', 'innovation', 'collaboration', 'presentation']
          }
        },
        ['TeachingAssistant', 'CampusAnalyst']
      );

      return {
        ...report,
        certificates: await this.generateCertificates(projectId, report)
      };
    } catch (err) {
      throw createError(500, '项目评估失败: ' + err.message);
    }
  }

  private enrichProjectPlan(project) {
    return {
      ...project,
      resources: this.addInteractiveResources(project.resources),
      activities: this.addCollaborativeElements(project.activities),
      assessment: this.createAssessmentRubrics(project.objectives)
    };
  }
}

export const projectLearningService = new ProjectLearningService();
