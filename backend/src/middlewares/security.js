import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { createError } from '../utils/error.js';

// 基础安全配置
export const securityMiddleware = [
  // 安全头设置
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.openai.com"]
      }
    }
  }),
  
  // 防止NoSQL注入
  mongoSanitize(),
  
  // 防止XSS攻击
  xss(),
];

// API请求限制
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP限制100次请求
  message: '请求过于频繁，请稍后再试',
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  }
});

// AI API请求限制
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 50, // 每个用户限制50次请求
  keyGenerator: (req) => req.user.id, // 基于用户ID限制
  message: 'AI服务请求次数已达上限',
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  }
});

// 文件上传安全检查
export const uploadSecurity = (req, res, next) => {
  // 文件大小检查已由multer处理
  // 这里可以添加额外的安全检查
  if (req.file) {
    // 检查文件类型
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimes.includes(req.file.mimetype)) {
      return next(createError(400, '不支持的文件类型'));
    }
    
    // 检查文件名
    const filename = req.file.originalname;
    if (filename.includes('..') || filename.includes('/')) {
      return next(createError(400, '非法的文件名'));
    }
  }
  next();
};
