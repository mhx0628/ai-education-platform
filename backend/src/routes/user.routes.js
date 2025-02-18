import { Router } from 'express';
import { verifyToken, checkRole } from '../middlewares/auth.js';
import { userController } from '../controllers/user.controller.js';

const router = Router();

// 用户信息管理
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.get('/notifications', verifyToken, userController.getNotifications);

// 班级和课程管理
router.get('/classes', verifyToken, userController.getClasses);
router.get('/classes/:classId/students', verifyToken, checkRole(['teacher']), userController.getClassStudents);
router.get('/classes/:classId/analytics', verifyToken, checkRole(['teacher']), userController.getClassAnalytics);

// 权限管理
router.get('/permissions', verifyToken, userController.getPermissions);
router.post('/permissions', verifyToken, checkRole(['admin']), userController.updatePermissions);

// 组织架构
router.get('/organizations', verifyToken, userController.getOrganizations);
router.get('/organizations/:orgId/members', verifyToken, checkRole(['admin']), userController.getOrgMembers);
router.post('/organizations/:orgId/members', verifyToken, checkRole(['admin']), userController.addOrgMember);

export default router;
