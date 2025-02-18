import { asyncHandler } from '../utils/asyncHandler.js';
import { communityService } from '../services/community.service.js';
import { aiService } from '../services/ai.service.js';

export const communityController = {
  createPost: asyncHandler(async (req, res) => {
    const post = await communityService.createPost(req.user.id, req.body);
    res.success(post);
  }),

  getRecommendedPosts: asyncHandler(async (req, res) => {
    const posts = await communityService.getRecommendedPosts(
      req.user.id,
      req.query
    );
    res.success(posts);
  }),

  createLearningGroup: asyncHandler(async (req, res) => {
    const group = await communityService.createLearningGroup({
      ...req.body,
      creatorId: req.user.id
    });
    res.success(group);
  }),

  joinGroup: asyncHandler(async (req, res) => {
    const result = await communityService.joinGroup(
      req.params.groupId,
      req.user.id
    );
    res.success(result);
  }),

  getGroupActivities: asyncHandler(async (req, res) => {
    const activities = await communityService.getGroupActivities(
      req.params.groupId
    );
    res.success(activities);
  }),

  askAIAssistant: asyncHandler(async (req, res) => {
    const answer = await aiService.getGroupAssistantResponse({
      groupId: req.params.groupId,
      userId: req.user.id,
      question: req.body.question
    });
    res.success(answer);
  })
};
