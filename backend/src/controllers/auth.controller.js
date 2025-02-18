import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/index.js';
import { createError } from '../utils/error.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { username, password, role, name } = req.body;

      // 检查用户是否已存在
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw createError(400, '用户名已存在');
      }

      // 创建新用户
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        username,
        password: hashedPassword,
        role,
        profile: { realName: name }
      });

      await user.save();

      res.status(201).json({
        message: '注册成功',
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // 查找用户
      const user = await User.findOne({ username });
      if (!user) {
        throw createError(401, '用户名或密码错误');
      }

      // 验证密码
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw createError(401, '用户名或密码错误');
      }

      // 生成token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          profile: user.profile
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        throw createError(404, '用户不存在');
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
};
