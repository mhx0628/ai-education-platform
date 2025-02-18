import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { checkRole } from '../middlewares/auth.js';

const router = Router();

// 获取学习数据分析
router.get('/learning',
  checkRole(['teacher', 'principal', 'admin']),
  analyticsController.getLearningAnalytics
);

// 获取使用情况分析
router.get('/usage',
  checkRole(['principal', 'admin']),
  analyticsController.getUsageAnalytics
);

// 生成分析报告
router.post('/reports/generate',
  checkRole(['teacher', 'principal', 'admin']),
  analyticsController.generateReport
);

// 预测趋势
router.post('/predict',
  checkRole(['principal', 'admin']),
  analyticsController.predictTrends
);

// 获取数据看板
router.get('/dashboard',
  checkRole(['principal', 'admin']),
  analyticsController.getDashboard
);

export default router;
