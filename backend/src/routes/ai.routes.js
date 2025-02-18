import { Router } from 'express';
import { verifyToken, checkRole } from '../middlewares/auth.js';
import { aiController } from '../controllers/ai.controller.js';
import { aiRateLimiter } from '../middlewares/security.js';
import { upload } from '../config/storage.js';

const router = Router();

// AI助手相关路由
router.post('/chat', verifyToken, aiController.chatWithAI);
router.post('/analyze-work', verifyToken, aiController.analyzeWork);
router.post('/generate-lesson-plan', verifyToken, checkRole(['teacher']), aiController.generateLessonPlan);
router.post('/evaluate-answer', verifyToken, aiController.evaluateAnswer);

// 智能体相关路由
router.post('/agents', verifyToken, checkRole(['admin']), aiController.createAgent);
router.get('/agents', verifyToken, aiController.listAgents);
router.post('/agents/:id/interact', verifyToken, aiController.interactWithAgent);
router.post('/agents/collaborate', verifyToken, aiController.collaborateWithAgents);

// AI资源相关路由
router.post('/resources/generate', verifyToken, aiController.generateResource);
router.post('/resources/enhance', verifyToken, aiController.enhanceResource);
router.post('/resources/translate', verifyToken, aiController.translateResource);

// AI内容生成
router.post('/generate/lesson-plan', 
  checkRole(['teacher']), 
  aiController.generateLessonPlan
);

router.post('/generate/ppt',
  checkRole(['teacher']),
  aiController.generatePPT
);

router.post('/generate/paper',
  checkRole(['teacher', 'student']),
  aiController.generatePaper
);

// AI学习助手
router.post('/assistant/analyze',
  aiController.analyzeQuestion
);

router.post('/assistant/hint',
  aiController.getHint
);

router.post('/assistant/evaluate',
  aiController.evaluateAnswer
);

// AI创作
router.post('/create/image',
  upload.single('file'),
  aiController.generateImage
);

router.post('/create/video',
  upload.array('files', 10),
  aiController.generateVideo
);

// AI校园大脑
router.get('/brain/analytics',
  checkRole(['admin', 'principal']),
  aiController.getBrainAnalytics
);

router.post('/brain/alert',
  checkRole(['admin', 'principal']),
  aiController.processAlert
);

export default router;
