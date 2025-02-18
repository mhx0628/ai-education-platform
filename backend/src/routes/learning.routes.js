import { Router } from 'express';
import { verifyToken, checkRole } from '../middlewares/auth.js';
import { learningController } from '../controllers/learning.controller.js';
import { upload } from '../config/storage.js';

const router = Router();

// 学科闯关系统
router.get('/challenges', verifyToken, learningController.listChallenges);
router.get('/challenges/:id', verifyToken, learningController.getChallengeDetail);
router.post('/challenges/:id/attempt', verifyToken, learningController.startChallenge);
router.put('/challenges/:id/attempt/:attemptId', verifyToken, learningController.submitChallenge);

// 学习记录
router.post('/records', verifyToken, learningController.createRecord);
router.get('/records', verifyToken, learningController.getRecords);
router.get('/records/summary', verifyToken, learningController.getLearningSummary);
router.get('/records/analytics', verifyToken, learningController.getAnalytics);

// 成长档案
router.get('/portfolio/:studentId', verifyToken, learningController.getPortfolio);
router.get('/portfolio/:studentId/report/:period', verifyToken, learningController.generateReport);
router.post('/portfolio/:studentId/comment', verifyToken, checkRole(['teacher']), learningController.addComment);

// 学习社区
router.get('/courses', verifyToken, learningController.listCourses);
router.post('/courses/:courseId/enroll', verifyToken, learningController.enrollCourse);
router.get('/courses/:courseId/progress', verifyToken, learningController.getCourseProgress);
router.post('/courses/:courseId/feedback', verifyToken, learningController.submitCourseFeedback);

// 闯关系统路由
router.get('/challenges/:subject',
  verifyToken,
  learningController.getChallenges
);

router.get('/challenge/:id',
  verifyToken,
  learningController.getChallengeDetail
);

router.post('/challenge/:id/attempt',
  verifyToken,
  checkRole(['student']),
  learningController.submitChallenge
);

// 学习社区路由
router.get('/courses',
  verifyToken,
  learningController.getCourses
);

router.get('/course/:id',
  verifyToken,
  learningController.getCourseDetail
);

router.post('/course/:id/enroll',
  verifyToken,
  learningController.enrollCourse
);

// 学习进度路由
router.get('/progress',
  verifyToken,
  learningController.getProgress
);

router.get('/progress/analytics',
  verifyToken,
  learningController.getProgressAnalytics
);

// 作品提交路由
router.post('/works',
  verifyToken,
  upload.array('files', 5),
  learningController.submitWork
);

router.get('/works',
  verifyToken,
  learningController.getWorks
);

// AI学习助手路由
router.post('/assistant/help',
  verifyToken,
  learningController.getAIHelp
);

router.post('/assistant/analyze',
  verifyToken,
  learningController.analyzeQuestion
);

export default router;
