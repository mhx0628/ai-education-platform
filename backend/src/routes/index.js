import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import learningRoutes from './learning.routes.js';
import uploadRoutes from './upload.routes.js';
import communityRoutes from './community.routes.js';
import aiRoutes from './ai.routes.js';
import schoolBrainRoutes from './school-brain.routes.js';

import { verifyToken } from '../middlewares/auth.js';
import { rateLimit } from '../middlewares/rate-limit.js';

const router = Router();

// API版本控制
const API_VERSION = '/v1';

// 开放路由
router.use(`${API_VERSION}/auth`, authRoutes);

// 受保护路由
router.use(`${API_VERSION}/users`, verifyToken, userRoutes);
router.use(`${API_VERSION}/learning`, verifyToken, learningRoutes);
router.use(`${API_VERSION}/upload`, verifyToken, uploadRoutes);
router.use(`${API_VERSION}/community`, verifyToken, communityRoutes);
router.use(`${API_VERSION}/ai`, verifyToken, rateLimit, aiRoutes);
router.use(`${API_VERSION}/school-brain`, verifyToken, schoolBrainRoutes);

// API文档路由
if (process.env.NODE_ENV === 'development') {
  router.use('/docs', express.static('docs'));
}

export default router;
