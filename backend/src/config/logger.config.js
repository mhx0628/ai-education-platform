import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const loggerConfig = {
  // 日志级别定义
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  },

  // 日志颜色配置
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue'
  },

  // 日志格式配置
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json(),
    winston.format.prettyPrint()
  ),

  // 日志传输配置
  transports: {
    console: {
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
      handleExceptions: true,
      format: winston.format.cli()
    },
    file: {
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info'
    },
    error: {
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error'
    }
  },

  // 监控配置
  monitoring: {
    enabled: true,
    metrics: ['error_rate', 'response_time', 'request_count'],
    alertThresholds: {
      error_rate: 0.1,
      response_time: 2000
    }
  }
};

// 创建日志实例
const logger = winston.createLogger({
  levels: loggerConfig.levels,
  format: loggerConfig.format,
  transports: [
    new winston.transports.Console(loggerConfig.transports.console),
    new DailyRotateFile(loggerConfig.transports.file),
    new DailyRotateFile(loggerConfig.transports.error)
  ]
});

// 开发环境下的额外配置
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
