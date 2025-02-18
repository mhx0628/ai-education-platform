import { Activity } from '../models/Activity.js';
import { Content } from '../models/Content.js';
import { User } from '../models/User.js';
import { createError } from '../utils/error.js';
import { aiService } from '../services/ai.service.js';

export const activityController = {
  async createActivity(req, res, next) {
    try {
      const { title, type, category, description, rules, startDate, endDate } = req.body;
      const organizationId = req.user.organization;

      // 验证日期
      if (new Date(startDate) >= new Date(endDate)) {
        return next(createError(400, '开始时间必须早于结束时间'));
      }

      const activity = new Activity({
        title,
        type,
        category,
        description,
        rules,
        startDate,
        endDate,
        organization: organizationId,
        status: 'published'
      });

      await activity.save();
      res.status(201).json(activity);
    } catch (err) {
      next(err);
    }
  },

  async submitWork(req, res, next) {
    try {
      const { activityId } = req.params;
      const { contentId } = req.body;
      const userId = req.user.id;

      const activity = await Activity.findById(activityId);
      if (!activity) {
        return next(createError(404, '活动不存在'));
      }

      // 检查提交时间
      const now = new Date();
      if (now < new Date(activity.startDate) || now > new Date(activity.endDate)) {
        return next(createError(400, '不在活动提交时间范围内'));
      }

      // 检查作品
      const content = await Content.findById(contentId);
      if (!content || content.creator.toString() !== userId) {
        return next(createError(400, '作品不存在或无权提交'));
      }

      // 使用AI评估作品
      const aiEvaluation = await aiService.evaluateWork(content);

      activity.submissions.push({
        user: userId,
        work: contentId,
        aiEvaluation,
        publicVotes: 0,
        expertScores: []
      });

      await activity.save();
      res.json({ message: '作品提交成功' });
    } catch (err) {
      next(err);
    }
  },

  async voteWork(req, res, next) {
    try {
      const { activityId, submissionId } = req.params;
      const userId = req.user.id;

      const activity = await Activity.findById(activityId);
      if (!activity) {
        return next(createError(404, '活动不存在'));
      }

      const submission = activity.submissions.id(submissionId);
      if (!submission) {
        return next(createError(404, '作品不存在'));
      }

      // 检查是否已投票
      const hasVoted = await checkUserVote(activityId, submissionId, userId);
      if (hasVoted) {
        return next(createError(400, '已经为该作品投票'));
      }

      submission.publicVotes += 1;
      await activity.save();

      // 更新排名
      await updateRankings(activityId);

      res.json({ message: '投票成功' });
    } catch (err) {
      next(err);
    }
  },

  async expertScore(req, res, next) {
    try {
      const { activityId, submissionId } = req.params;
      const { score, comment } = req.body;
      const expertId = req.user.id;

      // 验证专家身份
      const expert = await User.findById(expertId);
      if (!expert.roles.includes('expert')) {
        return next(createError(403, '无评分权限'));
      }

      const activity = await Activity.findById(activityId);
      const submission = activity.submissions.id(submissionId);
      
      submission.expertScores.push({
        expert: expertId,
        score,
        comment
      });

      // 计算最终得分
      submission.finalScore = calculateFinalScore(submission);
      await activity.save();
      
      // 更新排名
      await updateRankings(activityId);

      res.json({ message: '评分成功' });
    } catch (err) {
      next(err);
    }
  }
};

// 计算最终得分
function calculateFinalScore(submission) {
  const publicScore = submission.publicVotes * 1; // 每个公众投票1分
  const expertScores = submission.expertScores.map(es => es.score);
  const averageExpertScore = expertScores.length > 0 
    ? (expertScores.reduce((a, b) => a + b, 0) / expertScores.length) * 100 
    : 0;
  
  return (publicScore + averageExpertScore) / 2;
}

// 更新活动排名
async function updateRankings(activityId) {
  const activity = await Activity.findById(activityId);
  
  // 根据最终得分排序
  activity.submissions.sort((a, b) => b.finalScore - a.finalScore);
  
  // 更新排名
  activity.submissions.forEach((submission, index) => {
    submission.ranking = index + 1;
  });

  await activity.save();
}
