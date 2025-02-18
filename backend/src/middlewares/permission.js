import { School } from '../models/School.js';
import { SchoolGroup } from '../models/SchoolGroup.js';
import { createError } from '../utils/error.js';

export const checkSchoolAccess = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const { role, district, id: userId } = req.user;

    // 系统管理员直接放行
    if (role === 'system_admin') return next();

    const school = await School.findById(schoolId);
    if (!school) {
      throw createError(404, '学校不存在');
    }

    // 教育局用户权限检查
    if (role === 'bureau_admin') {
      if (school.district.toString() !== district.toString()) {
        throw createError(403, '无权访问该学校数据');
      }
      return next();
    }

    // 校长权限检查
    if (role === 'principal') {
      const isPrincipal = school.principals.some(
        p => p.userId.toString() === userId
      );
      if (isPrincipal) return next();

      // 如果是集团校校长，检查是否有权限
      if (school.isGroupMember) {
        const group = await SchoolGroup.findOne({
          _id: school.groupId,
          'administrators.userId': userId
        });
        if (group) return next();
      }
    }

    throw createError(403, '无访问权限');
  } catch (error) {
    next(error);
  }
};

// 其他权限中间件...
