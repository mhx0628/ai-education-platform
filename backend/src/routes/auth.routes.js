import { Router } from 'express';
import { userValidation } from '../middlewares/validator.js';
import { authController } from '../controllers/auth.controller.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = Router();

router.post('/register', userValidation.register, authController.register);
router.post('/login', userValidation.login, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// 验证码
router.get('/captcha', authController.generateCaptcha);
router.post('/verify-captcha', authController.verifyCaptcha);

// OAuth登录
router.get('/oauth/:provider', authController.oauthLogin);
router.get('/oauth/:provider/callback', authController.oauthCallback);

// 组织邀请码验证
router.post('/verify-invite', authController.verifyInviteCode);

export default router;
