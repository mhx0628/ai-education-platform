import { maxKBService } from './maxkb.service.js';
import { createError } from '../utils/error.js';

class ContentModerationService {
  constructor() {
    this.sensitiveCategories = [
      'violence',
      'harassment',
      'hate_speech',
      'adult_content',
      'dangerous_behavior',
      'misinformation'
    ];
  }

  async moderateContent(content, type) {
    try {
      // 使用AI进行内容审核
      const analysis = await maxKBService.collaborativeTask(
        {
          type: 'content_moderation',
          data: { content, type },
          requirements: {
            categories: this.sensitiveCategories,
            strictness: 'high',
            context: 'education'
          }
        },
        ['SafetyGuardian']
      );

      // 处理审核结果
      return this.processModeration(analysis);
    } catch (err) {
      throw createError(500, '内容审核失败: ' + err.message);
    }
  }

  async moderateUserGeneratedContent(content, userId) {
    try {
      // 获取用户信息和历史记录
      const userContext = await this.getUserModerationContext(userId);
      
      const moderation = await this.moderateContent(content, 'ugc');
      
      // 更新用户审核历史
      await this.updateUserModerationHistory(userId, moderation);

      return {
        ...moderation,
        userWarnings: this.generateUserWarnings(moderation, userContext)
      };
    } catch (err) {
      throw createError(500, 'UGC审核失败: ' + err.message);
    }
  }

  async batchModerateContent(contents) {
    try {
      const results = await Promise.all(
        contents.map(content => this.moderateContent(content, content.type))
      );

      return {
        results,
        summary: this.generateModerationSummary(results)
      };
    } catch (err) {
      throw createError(500, '批量审核失败: ' + err.message);
    }
  }

  private processModeration(analysis) {
    const result = {
      isApproved: analysis.severity === 'safe',
      severity: analysis.severity,
      categories: analysis.flaggedCategories,
      confidence: analysis.confidence,
      suggestedActions: []
    };

    if (!result.isApproved) {
      result.suggestedActions = this.generateActionSuggestions(analysis);
    }

    return result;
  }

  private generateActionSuggestions(analysis) {
    const actions = [];
    
    if (analysis.severity === 'high') {
      actions.push('block_content', 'notify_admin');
    } else if (analysis.severity === 'medium') {
      actions.push('flag_for_review', 'notify_user');
    } else {
      actions.push('add_warning');
    }

    return actions;
  }
}

export const contentModerationService = new ContentModerationService();
