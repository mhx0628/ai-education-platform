import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import { createError } from '../utils/error.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { maxKBService } from '../services/maxkb.service.js';

export const userController = {
  // 获取用户信息
  getProfile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('organization', 'name type')
      .lean();

    res.success(user);
  }),

  // 更新用户信息
  updateProfile: asyncHandler(async (req, res) => {
    const { password, roles, ...updateData } = req.body;
    
    // 敏感字段不允许直接更新
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    res.success(user);
  }),

  // 获取用户通知
  getNotifications: asyncHandler(async (req, res) => {
    const { page = 1, pageSize = 20 } = req.query;

    const notifications = await User.findById(req.user.id)
      .select('notifications')
      .slice('notifications', [(page - 1) * pageSize, pageSize]);

    res.success(notifications);
  }),

  // 获取用户班级
  getClasses: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
      .populate('classes.grade classes.class')
      .select('classes')
      .lean();

    res.success(user.classes);
  }),

  // 获取班级学生（教师权限）
  getClassStudents: asyncHandler(async (req, res) => {
    const { classId } = req.params;
    const { role } = req.user;

    if (!['teacher', 'admin'].includes(role)) {
      throw createError(403, '无权访问');
    }

    const students = await User.find({
      'classes.class': classId,
      roles: 'student'
    }).select('name avatar profile classes').lean();

    res.success(students);
  }),

  // 获取班级分析数据（教师权限）
  getClassAnalytics: asyncHandler(async (req, res) => {
    const { classId } = req.params;
    const { role } = req.user;

    if (!['teacher', 'admin'].includes(role)) {
      throw createError(403, '无权访问');
    }

    // 使用AI分析班级数据
    const analytics = await maxKBService.collaborativeTask(
      {
        type: 'class_analysis',
        data: {
          classId,
          timeRange: req.query.timeRange || '30d'
        }
      },
      ['CampusAnalyst']
    );

    res.success(analytics);
  }),

  // 获取用户权限
  getPermissions: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
      .select('roles organization')
      .populate('organization', 'type')
      .lean();

    const permissions = await generateUserPermissions(user);
    res.success(permissions);
  }),

  // 更新用户权限（管理员）
  updatePermissions: asyncHandler(async (req, res) => {
    const { userId, roles } = req.body;

    if (!req.user.roles.includes('admin')) {
      throw createError(403, '无权操作');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { roles },
      { new: true }
    ).select('name roles');

    res.success(user);
  })
};

// 生成用户权限
async function generateUserPermissions(user) {
  const basePermissions = {
    profile: ['view', 'edit'],
    notification: ['view']
  };

  const rolePermissions = {
    student: {
      learning: ['view', 'submit'],
      challenge: ['view', 'attempt'],
      project: ['view', 'join']
    },
    teacher: {
      class: ['view', 'manage'],
      student: ['view', 'assess'],
      content: ['create', 'edit', 'delete']
    },
    admin: {
      user: ['view', 'manage'],
      organization: ['view', 'manage'],
      system: ['configure']
    }
  };

  const permissions = { ...basePermissions };
  user.roles.forEach(role => {
    Object.assign(permissions, rolePermissions[role]);
  });

  return permissions;
}
