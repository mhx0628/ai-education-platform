import { Competition } from '../models/Competition.js';
import { createError } from '../utils/error.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { contentModerationService } from '../services/content-moderation.service.js';

export const competitionController = {
  // 获取竞赛列表
  getCompetitions: asyncHandler(async (req, res) => {
    const { page = 1, pageSize = 10, type, status } = req.query;
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;

    const total = await Competition.countDocuments(query);
    const competitions = await Competition.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('organizer', 'name logo')
      .lean();

    res.success({
      items: competitions,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    });
  }),

  // 创建竞赛
  createCompetition: asyncHandler(async (req, res) => {
    const { organization } = req.user;
    const competition = new Competition({
      ...req.body,
      organizer: organization
    });

    // 内容审核
    const moderationResult = await contentModerationService.moderateContent({
      content: req.body.description + req.body.rules,
      type: 'competition'
    });

    if (!moderationResult.isApproved) {
      throw createError(400, '内容包含不当信息');
    }

    await competition.save();
    res.success(competition);
  }),

  // 获取竞赛详情
  getCompetitionDetail: asyncHandler(async (req, res) => {
    const competition = await Competition.findById(req.params.id)
      .populate('organizer', 'name logo')
      .populate('participants.user', 'name avatar school')
      .populate('settings.judgePanel', 'name avatar title')
      .lean();

    if (!competition) {
      throw createError(404, '竞赛不存在');
    }

    res.success(competition);
  }),

  // 报名参加竞赛
  enrollCompetition: asyncHandler(async (req, res) => {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      throw createError(404, '竞赛不存在');
    }

    if (competition.status !== 'enrolling') {
      throw createError(400, '竞赛不在报名阶段');
    }

    if (competition.settings.maxParticipants && 
        competition.participants.length >= competition.settings.maxParticipants) {
      throw createError(400, '报名人数已满');
    }

    const alreadyEnrolled = competition.participants.some(
      p => p.user.toString() === req.user.id
    );
    if (alreadyEnrolled) {
      throw createError(400, '您已经报名过了');
    }

    competition.participants.push({
      user: req.user.id,
      enrollDate: new Date()
    });

    await competition.save();
    res.success({ message: '报名成功' });
  }),

  // 提交作品
  submitWork: asyncHandler(async (req, res) => {
    const { workUrl } = req.body;
    const competition = await Competition.findById(req.params.id);
    
    if (!competition) {
      throw createError(404, '竞赛不存在');
    }

    const participant = competition.participants.find(
      p => p.user.toString() === req.user.id
    );

    if (!participant) {
      throw createError(400, '您尚未报名该竞赛');
    }

    // 审核作品内容
    const moderationResult = await contentModerationService.moderateContent({
      content: workUrl,
      type: 'competition_work'
    });

    if (!moderationResult.isApproved) {
      throw createError(400, '作品内容不合规');
    }

    participant.submission = {
      workUrl,
      submissionTime: new Date()
    };

    await competition.save();
    res.success({ message: '提交成功' });
  })
};
