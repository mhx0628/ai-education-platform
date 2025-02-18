import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 50,
      wtimeoutMS: 2500
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // 数据库事件监听
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB连接错误:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB连接断开，尝试重新连接...');
      setTimeout(connectDB, 5000);
    });

    // 优雅关闭数据库连接
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB连接已关闭');
      process.exit(0);
    });

  } catch (error) {
    logger.error('MongoDB连接失败:', error);
    process.exit(1);
  }
};

// 数据库配置选项
const dbOptions = {
  autoIndex: process.env.NODE_ENV !== 'production', // 生产环境禁用自动索引
  serverSelectionTimeoutMS: 5000, // 服务器选择超时
  socketTimeoutMS: 45000, // Socket超时
  family: 4 // 强制IPv4
};

export { connectDB, dbOptions };
