import express from 'express';
import { auth } from '../middlewares/auth.js';
import { activityService } from '../services/activity.service.js';
import { validate } from '../middlewares/validate.js';
import { activitySchemas } from '../validations/activity.schema.js';

const router = express.Router();

// 创建活动
router.post('/',
  auth(),
  validate(activitySchemas.createActivity),
  async (req, res, next) => {
    try {
      const activity = await activityService.createActivity(req.body, req.user.id);
      res.status(201).json(activity);
    } catch (error) {
      next(error);
    }
  }
);

// 提交作品
router.post('/:activityId/submissions',
  auth(),
  validate(activitySchemas.submitWork),
  async (req, res, next) => {
    try {
      const submission = await activityService.submitWork(
        {
          ...req.body,
          activityId: req.params.activityId
        },
        req.user.id
      );
      res.status(201).json(submission);
    } catch (error) {
      next(error);
    }
  }
);

// 投票
router.post('/submissions/:submissionId/vote',
  auth(),
  validate(activitySchemas.vote),
  async (req, res, next) => {
    try {
      const result = await activityService.voteForSubmission(
        req.params.submissionId,
        req.body,
        req.user.id
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// 获取活动结果
router.get('/:activityId/results',
  auth(),
  async (req, res, next) => {
    try {
      const results = await activityService.getActivityResults(req.params.activityId);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
);

// 其他活动相关路由...

export default router;
