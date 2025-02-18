import { ApiError } from '../utils/error.js';

export const errorHandler = (err, req, res, next) => {
  // 开发环境打印错误堆栈
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // MongoDB错误处理
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'fail',
      message: Object.values(err.errors).map(e => e.message).join(', ')
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      status: 'fail',
      message: '数据重复'
    });
  }

  // 默认错误响应
  return res.status(500).json({
    status: 'error',
    message: '服务器内部错误'
  });
};

// 未找到路由处理
export const notFound = (req, res, next) => {
  next(new ApiError(404, `未找到路由: ${req.originalUrl}`));
};

// 异步错误处理包装器
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
