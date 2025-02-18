import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config/index.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middlewares/error.js';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 错误处理
app.use(errorHandler);

// 数据库连接
mongoose.connect(config.mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// 启动服务器
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
