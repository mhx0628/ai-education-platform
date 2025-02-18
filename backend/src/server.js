import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';

import connectDB from './config/database.js';
import routes from './routes/index.js';
import { securityMiddleware, rateLimiter } from './middlewares/security.js';
import { errorHandler, notFound } from './middlewares/error.js';
import { responseHandler } from './utils/response.js';
import { logRequest, logError } from './utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// 连接数据库
connectDB();

// 基础中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(compression());

// 安全中间件
app.use(securityMiddleware);
app.use('/api', rateLimiter);

// 响应格式化
app.use(responseHandler);

// 日志记录
app.use(logRequest);

// API路由
app.use('/api', routes);

// 静态文件服务
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

// 错误处理
app.use(notFound);
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
