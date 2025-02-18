import os from 'os';
import { Performance } from '../models/Performance.js';
import { ErrorLog } from '../models/ErrorLog.js';
import { Alert } from '../models/Alert.js';
import logger from '../utils/logger.js';

class MonitoringService {
  constructor() {
    this.metrics = {
      system: new Map(),
      application: new Map(),
      ai: new Map()
    };
    
    this.thresholds = {
      cpu: 80,        // CPU使用率警戒线
      memory: 85,     // 内存使用率警戒线
      apiLatency: 2000, // API响应时间警戒线(ms)
      errorRate: 5    // 错误率警戒线(%)
    };
  }

  async startMonitoring() {
    // 系统监控
    setInterval(() => this.collectSystemMetrics(), 30000);
    
    // 应用监控
    setInterval(() => this.collectAppMetrics(), 60000);
    
    // AI服务监控
    setInterval(() => this.monitorAIServices(), 120000);
    
    logger.info('系统监控服务已启动');
  }

  async collectSystemMetrics() {
    try {
      const metrics = {
        cpu: os.loadavg()[0],
        memory: (os.totalmem() - os.freemem()) / os.totalmem() * 100,
        uptime: os.uptime(),
        timestamp: Date.now()
      };

      await Performance.create({
        type: 'system',
        metrics
      });

      // 检查是否需要报警
      this.checkThresholds(metrics);
    } catch (error) {
      logger.error('系统指标采集失败:', error);
    }
  }

  async monitorAIServices() {
    try {
      const services = ['deepseek', 'maxkb', 'local-ai'];
      
      for (const service of services) {
        const status = await this.checkAIServiceHealth(service);
        
        if (!status.healthy) {
          await this.createAlert({
            service,
            type: 'ai_service_error',
            message: `AI服务异常: ${service}`,
            severity: 'high'
          });
        }
      }
    } catch (error) {
      logger.error('AI服务监控失败:', error);
    }
  }

  async createAlert(alertData) {
    try {
      const alert = await Alert.create({
        ...alertData,
        timestamp: new Date(),
        status: 'active'
      });

      // 发送通知
      await this.notifyAdmins(alert);

      return alert;
    } catch (error) {
      logger.error('创建告警失败:', error);
    }
  }

  private async checkAIServiceHealth(service) {
    // 检查AI服务健康状态
  }

  private async notifyAdmins(alert) {
    // 实现管理员通知逻辑
  }

  private checkThresholds(metrics) {
    // 检查指标是否超过阈值
  }
}

export const monitoringService = new MonitoringService();
