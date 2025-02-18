import { Router } from 'express';
import { verifyToken, checkRole } from '../middlewares/auth.js';
import { projectLearningService } from '../services/project-learning.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/generate', 
  verifyToken, 
  checkRole(['teacher']),
  asyncHandler(async (req, res) => {
    const project = await projectLearningService.generateProject(req.body);
    res.success(project);
  })
);

router.post('/:projectId/groups',
  verifyToken,
  checkRole(['teacher']),
  asyncHandler(async (req, res) => {
    const groups = await projectLearningService.createProjectGroup(
      req.params.projectId,
      req.body.students
    );
    res.success(groups);
  })
);

router.get('/:projectId/progress',
  verifyToken,
  asyncHandler(async (req, res) => {
    const progress = await projectLearningService.monitorProjectProgress(
      req.params.projectId
    );
    res.success(progress);
  })
);

router.post('/:projectId/evaluate',
  verifyToken,
  checkRole(['teacher']),
  asyncHandler(async (req, res) => {
    const evaluation = await projectLearningService.evaluateProject(
      req.params.projectId
    );
    res.success(evaluation);
  })
);

export default router;
