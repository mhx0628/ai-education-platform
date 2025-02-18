import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_education',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  env: process.env.NODE_ENV || 'development',
  
  // AI模型配置
  ai: {
    deepseek: {
      endpoint: process.env.DEEPSEEK_API_ENDPOINT,
      apiKey: process.env.DEEPSEEK_API_KEY
    },
    maxkb: {
      endpoint: process.env.MAXKB_ENDPOINT,
      apiKey: process.env.MAXKB_API_KEY
    }
  },
  
  // 文件上传配置
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg'],
    path: './uploads'
  },
  
  // 缓存配置
  cache: {
    ttl: 3600,
    prefix: 'aiedu:'
  }
};
