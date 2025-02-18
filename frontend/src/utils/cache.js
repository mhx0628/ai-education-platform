import { logger } from './logger';

class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.storageType = this.checkStorageAvailability();
  }

  // 检查存储可用性
  private checkStorageAvailability() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return 'localStorage';
    } catch (e) {
      try {
        sessionStorage.setItem('test', 'test');
        sessionStorage.removeItem('test');
        return 'sessionStorage';
      } catch (e) {
        return 'memory';
      }
    }
  }

  // 设置缓存
  async set(key, value, options = {}) {
    const {
      expires = 3600, // 默认1小时
      storage = 'auto', // auto, memory, local, session
      compress = false
    } = options;

    const cacheItem = {
      value,
      timestamp: Date.now(),
      expires: expires * 1000
    };

    try {
      if (compress) {
        cacheItem.value = await this.compress(value);
      }

      const storageMethod = this.determineStorage(storage);
      await this.setToStorage(storageMethod, key, cacheItem);
      
      return true;
    } catch (error) {
      logger.error('Cache set failed:', error);
      return false;
    }
  }

  // 获取缓存
  async get(key, options = {}) {
    const {
      storage = 'auto',
      defaultValue = null,
      decompress = false
    } = options;

    try {
      const storageMethod = this.determineStorage(storage);
      const cacheItem = await this.getFromStorage(storageMethod, key);

      if (!cacheItem) {
        return defaultValue;
      }

      // 检查是否过期
      if (this.isExpired(cacheItem)) {
        this.remove(key);
        return defaultValue;
      }

      let value = cacheItem.value;
      if (decompress) {
        value = await this.decompress(value);
      }

      return value;
    } catch (error) {
      logger.error('Cache get failed:', error);
      return defaultValue;
    }
  }

  // 移除缓存
  remove(key) {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      this.memoryCache.delete(key);
      return true;
    } catch (error) {
      logger.error('Cache remove failed:', error);
      return false;
    }
  }

  // 清除所有缓存
  clear() {
    try {
      localStorage.clear();
      sessionStorage.clear();
      this.memoryCache.clear();
      return true;
    } catch (error) {
      logger.error('Cache clear failed:', error);
      return false;
    }
  }

  // 获取所有缓存键
  keys() {
    const keys = new Set();
    
    // 内存缓存
    this.memoryCache.forEach((_, key) => keys.add(key));
    
    // localStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        keys.add(localStorage.key(i));
      }
    } catch (e) {
      logger.warn('Failed to get localStorage keys');
    }
    
    // sessionStorage
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        keys.add(sessionStorage.key(i));
      }
    } catch (e) {
      logger.warn('Failed to get sessionStorage keys');
    }

    return Array.from(keys);
  }

  // 检查缓存是否存在
  has(key) {
    return this.memoryCache.has(key) ||
           localStorage.getItem(key) !== null ||
           sessionStorage.getItem(key) !== null;
  }

  // 获取缓存大小
  size() {
    return {
      memory: this.memoryCache.size,
      localStorage: localStorage.length,
      sessionStorage: sessionStorage.length
    };
  }

  private determineStorage(storage) {
    if (storage === 'auto') {
      return this.storageType;
    }
    return storage;
  }

  private isExpired(cacheItem) {
    return Date.now() - cacheItem.timestamp > cacheItem.expires;
  }

  private async compress(value) {
    // 实现压缩逻辑
    return value;
  }

  private async decompress(value) {
    // 实现解压逻辑
    return value;
  }

  private async setToStorage(storageMethod, key, value) {
    const serialized = JSON.stringify(value);
    
    switch (storageMethod) {
      case 'memory':
        this.memoryCache.set(key, value);
        break;
      case 'localStorage':
        localStorage.setItem(key, serialized);
        break;
      case 'sessionStorage':
        sessionStorage.setItem(key, serialized);
        break;
    }
  }

  private async getFromStorage(storageMethod, key) {
    switch (storageMethod) {
      case 'memory':
        return this.memoryCache.get(key);
      case 'localStorage':
        const localData = localStorage.getItem(key);
        return localData ? JSON.parse(localData) : null;
      case 'sessionStorage':
        const sessionData = sessionStorage.getItem(key);
        return sessionData ? JSON.parse(sessionData) : null;
    }
  }
}

export const cacheManager = new CacheManager();
