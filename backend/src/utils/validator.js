import { createError } from './error.js';

class Validator {
  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static validatePassword(password) {
    // 密码至少8位，包含数字和字母
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  }

  static validatePhone(phone) {
    const re = /^1[3-9]\d{9}$/;
    return re.test(phone);
  }

  static validateRequired(fields, data) {
    const missing = fields.filter(field => !data[field]);
    if (missing.length) {
      throw createError(400, `缺少必填字段: ${missing.join(', ')}`);
    }
  }

  static validate(schema) {
    return (req, res, next) => {
      try {
        const errors = [];
        
        Object.keys(schema).forEach(key => {
          const rules = schema[key];
          const value = req[key];

          rules.forEach(rule => {
            if (!rule.validator(value)) {
              errors.push(rule.message);
            }
          });
        });

        if (errors.length) {
          throw createError(400, errors.join('; '));
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}

export default Validator;
