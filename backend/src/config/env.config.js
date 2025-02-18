export const envConfig = {
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_education',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 50
      }
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      password: process.env.REDIS_PASSWORD
    }
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiration: '7d',
    refreshTokenExpiration: '30d',
    sessionTimeout: 3600 // 1小时
  },

  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['image', 'video', 'audio', 'document'],
    storageType: process.env.STORAGE_TYPE || 'local', // local/s3/oss
    storagePath: process.env.STORAGE_PATH || './uploads'
  },

  security: {
    rateLimitWindow: 15 * 60 * 1000, // 15分钟
    maxRequestsPerWindow: 1000,
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000']
  }
};
