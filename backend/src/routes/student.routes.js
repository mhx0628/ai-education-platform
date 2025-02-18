import { Router } from 'express';
import { studentController } from '../controllers/student.controller.js';
import { upload } from '../config/storage.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = Router();

// 学习与闯关相关路由
router.get('/challenges/:subject',
  cacheMiddleware,
  studentController.getSubjectChallenges
);

router.post('/challenge/:id/attempt',
  studentController.startChallenge
);

router.post('/challenge/:id/submit',
  studentController.submitChallenge
);

// 作品与创作相关路由
router.post('/works',
  upload.array('files', 5),
  studentController.submitWork
);

router.get('/works',
  studentController.getMyWorks
);

// AI学习助手
router.post('/ai-assistant/help',
  studentController.getAIHelp
);

router.post('/ai-assistant/practice',
  studentController.getAIPractice
);

// 学习数据
router.get('/progress',
  studentController.getLearningProgress
);

router.get('/portfolio',
  studentController.getPortfolio
);

export default router;
