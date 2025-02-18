import { Community } from '../models/Community.js';
import { User } from '../models/User.js';
import { moderationService } from './moderation.service.js';
import { aiService } from './ai.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class CommunityService {
  async createPost(userId, data) {
    try {
      // 内容审核
      const moderationResult = await moderationService.moderateContent({
        text: data.title + data.content,
        type: 'community_post'
      });

      if (!moderationResult.isApproved) {
        throw createError(400, '内容不合规: ' + moderationResult.reason);
      }

      // AI内容增强
      const enhancedContent = await aiService.enhanceContent({
        type: 'community_post',
        content: data.content,
        tags: data.tags
      });

      const post = await Community.findByIdAndUpdate(
        data.communityId,
        {
          $push: {
            posts: {
              author: userId,
              title: data.title,
              content: enhancedContent,
              tags: data.tags,
              mediaUrls: data.mediaUrls,
              createdAt: new Date()
            }
          }
        },
        { new: true }
      );

      return post.posts[post.posts.length - 1];
    } catch (error) {
      logger.error('创建社区帖子失败:', error);
      throw error;
    }
  }

  async getRecommendedPosts(userId, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      
      // 获取用户兴趣和偏好
      const user = await User.findById(userId).select('interests preferences');
      
      // 基于用户画像推荐帖子
      const recommendedPosts = await Community.aggregate([
        { $unwind: '$posts' },
        {
          $match: {
            'posts.tags': { $in: user.interests },
            'visibility': 'public'
          }
        },
        {
          $addFields: {
            relevanceScore: {
              $sum: [
                { $multiply: ['$posts.likes', 0.3] },
                { $multiply: ['$posts.comments', 0.2] },
                { $cond: [
                  { $in: ['$posts.author', user.following] },
                  10,
                  0
                ]}
              ]
            }
          }
        },
        { $sort: { relevanceScore: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ]);

      return recommendedPosts;
    } catch (error) {
      logger.error('获取推荐帖子失败:', error);
      throw error;
    }
  }

  async createLearningGroup(data) {
    try {
      // 创建学习小组
      const group = await Community.create({
        type: 'learning_group',
        name: data.name,
        description: data.description,
        owner: data.creatorId,
        settings: {
          visibility: data.visibility || 'public',
          maxMembers: data.maxMembers || 20,
          aiModeration: {
            enabled: true,
            sensitivity: 'medium'
          }
        }
      });

      // 创建AI学习助手
      await this.setupLearningAssistant(group._id);

      return group;
    } catch (error) {
      logger.error('创建学习小组失败:', error);
      throw error;
    }
  }

  private async setupLearningAssistant(groupId) {
    try {
      const assistant = await aiService.createGroupAssistant({
        groupId,
        capabilities: ['qa', 'review', 'guidance'],
        personality: 'supportive'
      });

      await Community.findByIdAndUpdate(groupId, {
        'aiAssistant': {
          id: assistant.id,
          name: assistant.name,
          status: 'active'
        }
      });

      return assistant;
    } catch (error) {
      logger.error('设置学习助手失败:', error);
      throw error;
    }
  }

  private async moderateGroupActivity(groupId) {
    // 实现群组活动审核逻辑
  }
}

export const communityService = new CommunityService();
