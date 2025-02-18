import { Router } from 'express';
import { schoolBrainController } from '../controllers/school-brain.controller.js';
import { checkRole } from '../middlewares/auth.js';

const router = Router();

// 校园大脑智能分析
router.get('/insights',
  checkRole(['principal', 'admin']),
  schoolBrainController.getSchoolInsights
);

// 实时监控与预警
router.get('/monitoring',
  checkRole(['principal', 'admin']),
  schoolBrainController.getMonitoringData
);

// 校园事件处理
router.post('/events',
  checkRole(['teacher', 'principal', 'admin']),
  schoolBrainController.handleCampusEvent
);

// 智能预警系统
router.get('/alerts',
  checkRole(['principal', 'admin']),
  schoolBrainController.getAlerts
);

// 智能决策支持
router.post('/decisions/analyze',
  checkRole(['principal', 'admin']),
  schoolBrainController.analyzeDecision
);

export default router;
