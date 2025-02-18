export const cacheConfig = {
  // Redis缓存配置
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: 0,
    keyPrefix: 'aiedu:'
  },

  // 缓存策略配置
  strategies: {
    // API响应缓存
    api: {
      ttl: 300, // 5分钟
      maxSize: 1000, // 最大缓存条目数
      invalidationRules: {
        'user:*': ['GET'],
        'learning:*': ['GET'],
        'challenge:*': ['GET']
      }
    },
    // 用户会话缓存
    session: {
      ttl: 86400, // 24小时
      maxSize: 10000
    },
    // AI响应缓存
    ai: {
      ttl: 3600, // 1小时
      maxSize: 500,
      conditions: {
        minLength: 100, // 最小响应长度
        maxLength: 10000 // 最大响应长度
      }
    }
  },

  // 本地缓存配置（用于无Redis环境）
  local: {
    enabled: process.env.USE_LOCAL_CACHE === 'true',
    maxSize: 1000,
    ttl: 300
  },

  // 预加载配置
  preload: {
    enabled: true,
    keys: [
      'common:config',
      'subjects:list',
      'grades:list'
    ]
  },

  // 缓存监控配置
  monitoring: {
    enabled: true,
    sampleRate: 0.1, // 采样率
    alertThreshold: 0.8 // 缓存使用率告警阈值
  }
};
