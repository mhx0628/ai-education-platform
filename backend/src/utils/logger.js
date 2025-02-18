import winston from 'winston';
import { config } from '../config/index.js';
import DailyRotateFile from 'winston-daily-rotate-file';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logDir = join(__dirname, '../../logs');

// 自定义日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// 日志轮转配置
const dailyRotateTransport = new DailyRotateFile({
  filename: join(logDir, '%DATE%-app.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: logFormat
});

// 创建logger实例
const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    dailyRotateTransport
  ]
});

if (config.env === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// 请求日志中间件
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // 响应结束时记录日志
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('API请求', {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body,
      ip: req.ip,
      user: req.user?.id,
      status: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
};

// 错误日志记录
export const errorLogger = (err, req, res, next) => {
  logger.error('系统错误', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    user: req.user?.id
  });
  next(err);
};

export default logger;
