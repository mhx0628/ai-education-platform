import { Course } from '../models/Course.js';
import { User } from '../models/User.js';
import { createError } from '../utils/error.js';
import { aiService } from '../services/ai.service.js';

export const courseController = {
  async createCourse(req, res, next) {
    try {
      const { title, type, category, description, content, requirements } = req.body;
      const teacherId = req.user.id;

      // 验证教师权限
      const teacher = await User.findById(teacherId);
      if (!teacher.roles.includes('teacher')) {
        return next(createError(403, '只有教师可以创建课程'));
      }

      // 使用AI优化课程内容
      const enhancedContent = await aiService.enhanceCourseContent(content);
      
      const course = new Course({
        title,
        type,
        category,
        description,
        content: enhancedContent,
        requirements,
        teacher: teacherId,
        organization: teacher.organization
      });

      await course.save();
      res.status(201).json(course);
    } catch (err) {
      next(err);
    }
  },

  async listCourses(req, res, next) {
    try {
      const { category, type, level, organization } = req.query;
      const query = {};

      if (category) query.category = category;
      if (type) query.type = type;
      if (level) query.level = level;
      if (organization) query.organization = organization;

      const courses = await Course.find(query)
        .populate('teacher', 'name profile.avatar profile.title')
        .sort({ createdAt: -1 });

      res.json(courses);
    } catch (err) {
      next(err);
    }
  },

  async getCourseDetail(req, res, next) {
    try {
      const courseId = req.params.id;
      const course = await Course.findById(courseId)
        .populate('teacher', 'name profile')
        .populate('students.user', 'name profile');

      if (!course) {
        return next(createError(404, '课程不存在'));
      }

      // 检查访问权限
      const userId = req.user.id;
      const canAccess = await checkCourseAccess(course, userId);
      if (!canAccess) {
        return next(createError(403, '无权访问此课程'));
      }

      res.json(course);
    } catch (err) {
      next(err);
    }
  },

  async enrollCourse(req, res, next) {
    try {
      const courseId = req.params.id;
      const studentId = req.user.id;

      const course = await Course.findById(courseId);
      if (!course) {
        return next(createError(404, '课程不存在'));
      }

      // 检查是否已经报名
      const isEnrolled = course.students.some(s => s.user.toString() === studentId);
      if (isEnrolled) {
        return next(createError(400, '已经报名此课程'));
      }

      course.students.push({
        user: studentId,
        enrollDate: new Date(),
        progress: 0,
        status: 'active'
      });

      await course.save();
      res.json({ message: '报名成功' });
    } catch (err) {
      next(err);
    }
  }
};

// 检查课程访问权限
async function checkCourseAccess(course, userId) {
  // 课程教师可访问
  if (course.teacher._id.toString() === userId) return true;
  
  // 课程学生可访问
  if (course.students.some(s => s.user._id.toString() === userId)) return true;
  
  // 管理员可访问
  const user = await User.findById(userId);
  if (user.roles.includes('admin')) return true;
  
  // 同组织教师可访问
  if (user.roles.includes('teacher') && 
      user.organization.toString() === course.organization.toString()) {
    return true;
  }
  
  return false;
}
