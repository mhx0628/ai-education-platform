import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class AuthService {
  async login(credentials) {
    try {
      const { email, password } = credentials;
      
      const user = await User.findOne({ email });
      if (!user) {
        throw createError(401, '用户名或密码错误');
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw createError(401, '用户名或密码错误');
      }

      const token = this.generateToken(user);
      
      // 更新登录统计
      await User.findByIdAndUpdate(user._id, {
        $inc: { 'stats.loginCount': 1 },
        'stats.lastLogin': new Date()
      });

      return {
        user: this.sanitizeUser(user),
        token
      };
    } catch (error) {
      logger.error('登录失败:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const { email, role } = userData;

      // 检查角色权限
      const roleData = await Role.findOne({ name: role });
      if (!roleData) {
        throw createError(400, '无效的用户角色');
      }

      // 检查邮箱是否已注册
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw createError(400, '邮箱已被注册');
      }

      // 创建用户
      const user = await User.create({
        ...userData,
        permissions: roleData.permissions
      });

      const token = this.generateToken(user);

      return {
        user: this.sanitizeUser(user),
        token
      };
    } catch (error) {
      logger.error('注册失败:', error);
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user || user.status !== 'active') {
        throw createError(401, '无效的token');
      }

      return user;
    } catch (error) {
      logger.error('Token验证失败:', error);
      throw createError(401, '无效的token');
    }
  }

  private generateToken(user) {
    return jwt.sign(
      { 
        id: user._id,
        role: user.role,
        schoolId: user.affiliations?.schoolId
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  private sanitizeUser(user) {
    const { password, ...safeUser } = user.toObject();
    return safeUser;
  }
}

export const authService = new AuthService();
