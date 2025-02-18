import { body, param, query, validationResult } from 'express-validator';
import { createError } from '../utils/error.js';

// 验证结果处理中间件
export const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// 用户相关验证规则
export const userValidation = {
  register: [
    body('username').isLength({ min: 4 }).withMessage('用户名至少4个字符'),
    body('password').isLength({ min: 6 }).withMessage('密码至少6个字符'),
    body('name').notEmpty().withMessage('姓名不能为空'),
    body('role').isIn(['teacher', 'student', 'parent', 'admin']).withMessage('无效的角色类型'),
    validate
  ],
  
  createAgent: [
    body('name').notEmpty().withMessage('智能体名称不能为空'),
    body('type').isIn(['teaching', 'learning', 'assessment']).withMessage('无效的智能体类型'),
    body('capabilities').isArray().withMessage('能力列表格式错误'),
    validate
  ]
};

// 学习记录验证规则
export const learningValidation = {
  createRecord: [
    body('student').isMongoId().withMessage('无效的学生ID'),
    body('recordType').isIn(['homework', 'course', 'activity']).withMessage('无效的记录类型'),
    body('subject').optional().isString().withMessage('无效的学科'),
    validate
  ],
  
  submitChallenge: [
    body('answers').isArray().withMessage('答案格式错误'),
    body('timeSpent').isNumeric().withMessage('答题时间格式错误'),
    validate
  ]
};
