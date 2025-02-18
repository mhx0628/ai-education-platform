import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';  // 修正导入路径
import { User } from '../models/User.js';
import { createError } from '../utils/error.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.userId);
    
    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: '用户未授权' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: '无效的认证令牌' });
  }
};

export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '权限不足' });
    }
    next();
  };
};

export const checkPermission = (resource, action) => {
  return asyncHandler(async (req, res, next) => {
    const { organization, roles } = req.user;

    // 检查组织权限
    if (resource === 'organization') {
      const org = await Organization.findById(organization);
      if (!org) {
        throw createError(403, '无权访问该组织');
      }
    }

    // 检查资源权限
    const permissions = await generatePermissions(roles, organization);
    if (!permissions[resource]?.includes(action)) {
      throw createError(403, '无操作权限');
    }

    next();
  });
};

// 生成权限列表
async function generatePermissions(roles, organizationId) {
  const basePerms = {
    profile: ['view', 'edit'],
    message: ['view', 'send']
  };

  const rolePerms = {
    student: {
      course: ['view', 'enroll'],
      assignment: ['view', 'submit']
    },
    teacher: {
      course: ['view', 'create', 'edit'],
      student: ['view', 'assess']
    },
    admin: {
      user: ['view', 'create', 'edit', 'delete'],
      organization: ['view', 'manage']
    }
  };

  const permissions = { ...basePerms };
  roles.forEach(role => {
    Object.assign(permissions, rolePerms[role] || {});
  });

  return permissions;
}
