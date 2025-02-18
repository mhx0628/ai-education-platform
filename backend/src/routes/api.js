import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import learningRoutes from './learning.routes.js';
import teacherRoutes from './teacher.routes.js';
import studentRoutes from './student.routes.js';
import schoolRoutes from './school.routes.js';
import communityRoutes from './community.routes.js';
import uploadRoutes from './upload.routes.js';

import { verifyToken } from '../middlewares/auth.js';
import { rateLimit } from '../middlewares/rate-limit.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = Router();

// 基础路由
router.use('/auth', rateLimit, authRoutes);
router.use('/users', verifyToken, userRoutes);

// 学习相关路由
router.use('/learning', verifyToken, cacheMiddleware, learningRoutes);
router.use('/teacher', verifyToken, checkRole(['teacher', 'admin']), teacherRoutes);
router.use('/student', verifyToken, checkRole(['student']), studentRoutes);
router.use('/school', verifyToken, checkRole(['principal', 'admin']), schoolRoutes);

// 社区和上传路由
router.use('/community', verifyToken, communityRoutes);
router.use('/upload', verifyToken, uploadRoutes);

// AI服务路由
router.use('/ai', verifyToken, aiRoutes);

// 数据分析路由
router.use('/analytics', verifyToken, analyticsRoutes);

// 错误处理
router.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
});

export default router;
