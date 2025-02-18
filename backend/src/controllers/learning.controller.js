import { LearningRecord } from '../models/LearningRecord.js';
import { GrowthPortfolio } from '../models/GrowthPortfolio.js';
import { createError } from '../utils/error.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { aiService } from '../services/ai.service.js';
import { learningService } from '../services/learning.service.js';

export const learningController = {
  // 创建或更新学习记录
  async createRecord(req, res, next) {
    try {
      const { student, recordType, subject, content } = req.body;
      const record = new LearningRecord({
        student,
        recordType,
        subject,
        content,
        timestamps: {
          start: new Date(),
          duration: 0
        }
      });
      
      await record.save();
      await updateGrowthPortfolio(student);
      
      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  },

  // 获取学习记录列表
  async getRecords(req, res, next) {
    try {
      const { student, type, subject, startDate, endDate } = req.query;
      const query = { student };
      
      if (type) query.recordType = type;
      if (subject) query.subject = subject;
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const records = await LearningRecord.find(query)
        .sort({ createdAt: -1 })
        .limit(50);
      
      res.json(records);
    } catch (err) {
      next(err);
    }
  },

  // 生成学习报告
  async generateReport(req, res, next) {
    try {
      const { student, period } = req.params;
      const portfolio = await GrowthPortfolio.findOne({
        student,
        period,
        endDate: { $gte: new Date() }
      }).populate('student teacherComments.teacher');

      if (!portfolio) {
        return next(createError(404, '未找到相关学习档案'));
      }

      // 聚合分析数据
      const analysis = await aggregateStudentData(student, portfolio.startDate, portfolio.endDate);
      
      // 生成AI评估
      const aiEvaluation = await generateAIEvaluation(analysis);
      
      portfolio.aiEvaluation = aiEvaluation;
      await portfolio.save();

      res.json(portfolio);
    } catch (err) {
      next(err);
    }
  },

  // 获取闯关列表
  getChallenges: asyncHandler(async (req, res) => {
    const { subject } = req.params;
    const { level, page = 1, limit = 20 } = req.query;

    const challenges = await learningService.getChallenges({
      subject,
      level,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.list(challenges.items, challenges.total, page, limit);
  }),

  // 获取闯关详情
  getChallengeDetail: asyncHandler(async (req, res) => {
    const challenge = await learningService.getChallengeById(req.params.id);
    if (!challenge) {
      throw createError(404, '闯关不存在');
    }
    res.success(challenge);
  }),

  // 提交闯关答案
  submitChallenge: asyncHandler(async (req, res) => {
    const { answers } = req.body;
    const result = await learningService.evaluateChallenge(
      req.params.id,
      req.user.id,
      answers
    );
    res.success(result);
  }),

  // 获取课程列表
  getCourses: asyncHandler(async (req, res) => {
    const { type, level, page = 1, limit = 10 } = req.query;
    const courses = await learningService.getCourses({
      type,
      level,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    res.list(courses.items, courses.total, page, limit);
  }),

  // 获取课程详情
  getCourseDetail: asyncHandler(async (req, res) => {
    const course = await learningService.getCourseById(req.params.id);
    if (!course) {
      throw createError(404, '课程不存在');
    }
    res.success(course);
  }),

  // 报名课程
  enrollCourse: asyncHandler(async (req, res) => {
    await learningService.enrollCourse(req.params.id, req.user.id);
    res.success(null, '报名成功');
  }),

  // 获取学习进度
  getProgress: asyncHandler(async (req, res) => {
    const progress = await learningService.getStudentProgress(req.user.id);
    res.success(progress);
  }),

  // 获取进度分析
  getProgressAnalytics: asyncHandler(async (req, res) => {
    const { timeRange = '30d' } = req.query;
    const analytics = await learningService.analyzeProgress(req.user.id, timeRange);
    res.success(analytics);
  }),

  // 提交作品
  submitWork: asyncHandler(async (req, res) => {
    const files = req.files;
    const { title, description, type } = req.body;

    const work = await learningService.createWork({
      userId: req.user.id,
      title,
      description,
      type,
      files: files.map(file => ({
        url: file.path,
        type: file.mimetype
      }))
    });

    res.success(work);
  }),

  // 获取作品列表
  getWorks: asyncHandler(async (req, res) => {
    const { type, page = 1, limit = 10 } = req.query;
    const works = await learningService.getWorks({
      userId: req.user.id,
      type,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    res.list(works.items, works.total, page, limit);
  }),

  // 获取AI帮助
  getAIHelp: asyncHandler(async (req, res) => {
    const { question, context } = req.body;
    const help = await aiService.getStudyHelp(question, context);
    res.success(help);
  }),

  // 分析题目
  analyzeQuestion: asyncHandler(async (req, res) => {
    const { question, subject } = req.body;
    const analysis = await aiService.analyzeQuestion(question, subject);
    res.success(analysis);
  })
};

// 更新成长档案
async function updateGrowthPortfolio(studentId) {
  const periods = ['daily', 'weekly', 'monthly', 'semester'];
  for (const period of periods) {
    const dates = calculatePeriodDates(period);
    await GrowthPortfolio.findOneAndUpdate(
      {
        student: studentId,
        period,
        startDate: dates.start,
        endDate: dates.end
      },
      { $setOnInsert: { 
        academic: { subjects: [] },
        competencies: {
          cognitive: {},
          social: {},
          personal: {}
        }
      }},
      { upsert: true, new: true }
    );
  }
}

// 计算时间周期
function calculatePeriodDates(period) {
  const now = new Date();
  let start = new Date(now);
  let end = new Date(now);

  switch (period) {
    case 'daily':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'weekly':
      start.setDate(now.getDate() - now.getDay());
      end.setDate(start.getDate() + 6);
      break;
    case 'monthly':
      start.setDate(1);
      end.setMonth(start.getMonth() + 1);
      end.setDate(0);
      break;
    case 'semester':
      // 根据实际学期时间计算
      const month = now.getMonth() + 1;
      if (month >= 9 || month <= 2) {
        // 第一学期
        start.setMonth(8, 1); // 9月1日
        if (month <= 2) start.setFullYear(start.getFullYear() - 1);
        end.setFullYear(start.getFullYear(), 1, 31); // 次年1月31日
      } else {
        // 第二学期
        start.setMonth(2, 1); // 3月1日
        end.setMonth(7, 31); // 7月31日
      }
      break;
  }
  
  return { start, end };
}
