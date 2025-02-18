import Redis from 'ioredis';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

class CacheService {
  constructor() {
    this.redis = new Redis({
      host: config.redis.host || 'localhost',
      port: config.redis.port || 6379,
      password: config.redis.password,
      db: config.redis.db || 0,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });

    this.redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });
  }

  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      await this.redis.set(
        key,
        JSON.stringify(value),
        'EX',
        ttl
      );
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  // 缓存中间件
  cacheMiddleware(ttl = 3600) {
    return async (req, res, next) => {
      if (req.method !== 'GET') {
        return next();
      }

      const key = `cache:${req.originalUrl}`;
      try {
        const cachedData = await this.get(key);
        if (cachedData) {
          return res.json(cachedData);
        }

        // 修改res.json方法以缓存响应
        const originalJson = res.json;
        res.json = async (data) => {
          await this.set(key, data, ttl);
          return originalJson.call(res, data);
        };

        next();
      } catch (error) {
        logger.error('Cache middleware error:', error);
        next();
      }
    };
  }
}

export const cacheService = new CacheService();
export const cache = cacheService.cacheMiddleware.bind(cacheService);
