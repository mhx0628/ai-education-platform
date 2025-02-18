import { logger } from './logger';
import { analytics } from './analytics';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoads: {},
      apiCalls: {},
      resources: {},
      errors: []
    };

    this.thresholds = {
      pageLoad: 3000,    // 3秒
      apiCall: 1000,     // 1秒
      resourceLoad: 2000  // 2秒
    };

    this.init();
  }

  init() {
    this.observePageLoads();
    this.observeAPIPerformance();
    this.observeResourceLoading();
    this.observeErrors();
    this.observeMemoryUsage();
  }

  observePageLoads() {
    // 使用Performance API监控页面加载性能
    window.addEventListener('load', () => {
      const paintMetrics = performance.getEntriesByType('paint');
      const navigationMetrics = performance.getEntriesByType('navigation')[0];

      this.metrics.pageLoads[window.location.pathname] = {
        timestamp: new Date().toISOString(),
        firstPaint: paintMetrics.find(p => p.name === 'first-paint')?.startTime,
        firstContentfulPaint: paintMetrics.find(p => p.name === 'first-contentful-paint')?.startTime,
        domInteractive: navigationMetrics.domInteractive,
        domComplete: navigationMetrics.domComplete,
        loadComplete: navigationMetrics.loadEventEnd
      };

      this.analyzePagePerformance();
    });
  }

  observeAPIPerformance() {
    // 拦截并监控API调用性能
    const originalFetch = window.fetch;
    window.fetch = async (url, options) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(url, options);
        this.recordAPICall(url, startTime, performance.now());
        return response;
      } catch (error) {
        this.recordAPIError(url, error);
        throw error;
      }
    };
  }

  observeResourceLoading() {
    // 监控资源加载性能
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.initiatorType !== 'fetch' && entry.initiatorType !== 'xmlhttprequest') {
          this.metrics.resources[entry.name] = {
            type: entry.initiatorType,
            duration: entry.duration,
            size: entry.transferSize,
            timestamp: new Date().toISOString()
          };
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  observeErrors() {
    // 监控JavaScript错误
    window.addEventListener('error', (event) => {
      this.metrics.errors.push({
        type: 'error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: new Date().toISOString()
      });
    });

    // 监控Promise错误
    window.addEventListener('unhandledrejection', (event) => {
      this.metrics.errors.push({
        type: 'promise_rejection',
        message: event.reason,
        timestamp: new Date().toISOString()
      });
    });
  }

  observeMemoryUsage() {
    // 定期检查内存使用情况
    if (performance.memory) {
      setInterval(() => {
        const memory = performance.memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          logger.warn('High memory usage detected:', {
            used: memory.usedJSHeapSize,
            total: memory.jsHeapSizeLimit
          });
        }
      }, 30000);
    }
  }

  private recordAPICall(url, startTime, endTime) {
    const duration = endTime - startTime;
    this.metrics.apiCalls[url] = {
      duration,
      timestamp: new Date().toISOString()
    };

    if (duration > this.thresholds.apiCall) {
      logger.warn('Slow API call detected:', {
        url,
        duration,
        threshold: this.thresholds.apiCall
      });
    }
  }

  private recordAPIError(url, error) {
    this.metrics.errors.push({
      type: 'api_error',
      url,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }

  private analyzePagePerformance() {
    const currentMetrics = this.metrics.pageLoads[window.location.pathname];
    if (currentMetrics.loadComplete > this.thresholds.pageLoad) {
      logger.warn('Slow page load detected:', {
        page: window.location.pathname,
        loadTime: currentMetrics.loadComplete,
        threshold: this.thresholds.pageLoad
      });

      // 发送性能数据到分析服务
      analytics.trackEvent('performance_issue', {
        type: 'slow_page_load',
        metrics: currentMetrics
      });
    }
  }

  getMetrics() {
    return this.metrics;
  }

  generateReport() {
    return {
      summary: this.generateSummary(),
      details: this.metrics,
      recommendations: this.generateRecommendations()
    };
  }

  private generateSummary() {
    // 生成性能摘要
    return {
      avgPageLoad: this.calculateAveragePageLoad(),
      avgApiLatency: this.calculateAverageAPILatency(),
      errorRate: this.calculateErrorRate(),
      timestamp: new Date().toISOString()
    };
  }

  private generateRecommendations() {
    // 基于收集的指标生成优化建议
    const recommendations = [];
    // ... 实现建议生成逻辑 ...
    return recommendations;
  }
}

export const performanceMonitor = new PerformanceMonitor();
