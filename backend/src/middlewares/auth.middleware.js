import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { createError } from '../utils/error.js';
import { cacheService } from '../services/cache.service.js';
import logger from '../utils/logger.js';

export const authMiddleware = {
  // 验证访问令牌
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        throw createError(401, '请先登录');
      }

      // 检查令牌是否被撤销
      const isRevoked = await cacheService.get(`revoked_token:${token}`);
      if (isRevoked) {
        throw createError(401, '令牌已失效');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 获取并缓存用户信息
      const cacheKey = `user:${decoded.id}`;
      let user = await cacheService.get(cacheKey);
      
      if (!user) {
        user = await User.findById(decoded.id)
          .select('-password')
          .lean();
          
        if (!user) {
          throw createError(401, '用户不存在');
        }
        
        await cacheService.set(cacheKey, user, 3600); // 缓存1小时
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        next(createError(401, '无效的访问令牌'));
      } else if (error.name === 'TokenExpiredError') {
        next(createError(401, '令牌已过期'));
      } else {
        next(error);
      }
    }
  },

  // 角色验证
  checkRole: (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return next(createError(401, '请先登录'));
      }

      const hasRole = req.user.roles.some(role => roles.includes(role));
      if (!hasRole) {
        return next(createError(403, '无权访问'));
      }

      next();
    };
  },

  // 权限验证
  checkPermission: (resource, action) => {
    return async (req, res, next) => {
      try {
        const hasPermission = await authMiddleware.verifyPermission(
          req.user,
          resource,
          action
        );

        if (!hasPermission) {
          throw createError(403, '无操作权限');
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  },

  // 验证权限
  verifyPermission: async (user, resource, action) => {
    // 实现权限验证逻辑
    return true; // 临时返回，需要实现具体逻辑
  }
};
