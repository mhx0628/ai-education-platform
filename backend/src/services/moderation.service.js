import { DeepSeekAPI } from '../utils/deepseek.js';
import { cacheService } from '../middlewares/cache.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class ModerationService {
  constructor() {
    this.deepseek = DeepSeekAPI;
    this.cacheKeyPrefix = 'moderation:';
    this.sensitiveWords = new Set();
    this.loadSensitiveWords();
  }

  async moderateContent(params) {
    const { text, type = 'text', cacheEnabled = true } = params;

    try {
      // 检查缓存
      if (cacheEnabled) {
        const cached = await this.getCachedResult(text);
        if (cached) return cached;
      }

      // 快速检查敏感词
      const quickCheck = this.quickSensitiveCheck(text);
      if (!quickCheck.isApproved) {
        return quickCheck;
      }

      // AI内容审核
      let result;
      switch (type) {
        case 'text':
          result = await this.moderateText(text);
          break;
        case 'image':
          result = await this.moderateImage(text);
          break;
        case 'video':
          result = await this.moderateVideo(text);
          break;
        default:
          throw createError(400, '不支持的内容类型');
      }

      // 缓存结果
      if (cacheEnabled && result.isApproved) {
        await this.cacheResult(text, result);
      }

      return result;
    } catch (error) {
      logger.error('内容审核失败:', error);
      throw createError(500, '内容审核服务异常');
    }
  }

  private async moderateText(text) {
    const prompt = `请审核以下内容是否包含违规信息（如政治敏感、暴力、色情、歧视等）：
                   ${text}
                   请以JSON格式返回审核结果，包含isApproved（布尔值）和reason（字符串）。`;

    const response = await this.deepseek.generate({
      prompt,
      temperature: 0.1,
      max_tokens: 100
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      logger.error('解析审核结果失败:', error);
      return { isApproved: false, reason: '审核服务异常' };
    }
  }

  private async getCachedResult(text) {
    const key = this.cacheKeyPrefix + this.hashText(text);
    return await cacheService.get(key);
  }

  private async cacheResult(text, result) {
    const key = this.cacheKeyPrefix + this.hashText(text);
    await cacheService.set(key, result, 86400); // 缓存24小时
  }

  private async loadSensitiveWords() {
    try {
      // 从配置或数据库加载敏感词
      const words = await this.loadSensitiveWordsFromDB();
      this.sensitiveWords = new Set(words);
    } catch (error) {
      logger.error('加载敏感词失败:', error);
    }
  }

  private quickSensitiveCheck(text) {
    for (const word of this.sensitiveWords) {
      if (text.includes(word)) {
        return {
          isApproved: false,
          reason: '包含敏感词',
          word
        };
      }
    }
    return { isApproved: true };
  }

  private hashText(text) {
    // 实现文本哈希
    return Buffer.from(text).toString('base64');
  }
}

export const moderationService = new ModerationService();
