import { Router } from 'express';
import { teacherController } from '../controllers/teacher.controller.js';
import { upload } from '../config/storage.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = Router();

// 教学资源管理
router.post('/lessons',
  upload.array('files', 5),
  teacherController.createLesson
);

router.put('/lessons/:id',
  teacherController.updateLesson
);

// AI教学助手
router.post('/ai-assistant/lesson-plan',
  teacherController.generateLessonPlan
);

router.post('/ai-assistant/exercise',
  teacherController.generateExercise
);

// 学生管理
router.get('/students',
  cacheMiddleware,
  teacherController.getStudents
);

router.get('/students/:id/progress',
  teacherController.getStudentProgress
);

// 数据分析
router.get('/analytics/class',
  teacherController.getClassAnalytics
);

router.get('/analytics/subject',
  teacherController.getSubjectAnalytics
);

export default router;
