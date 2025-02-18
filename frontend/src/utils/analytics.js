import { logger } from './logger';

class Analytics {
  constructor() {
    this.events = [];
    this.batchSize = 10;
    this.flushInterval = 30000; // 30秒
    this.initialized = false;

    // 定时发送数据
    setInterval(() => this.flush(), this.flushInterval);
  }

  init(config = {}) {
    try {
      this.userId = config.userId;
      this.sessionId = this._generateSessionId();
      this.initialized = true;

      // 记录会话开始
      this.trackEvent('session_start', {
        referrer: document.referrer,
        userAgent: navigator.userAgent
      });

      // 监听页面离开
      window.addEventListener('beforeunload', () => {
        this.trackEvent('session_end');
        this.flush(true); // 强制发送
      });

    } catch (error) {
      logger.error('Analytics initialization failed:', error);
    }
  }

  trackEvent(eventName, eventData = {}) {
    try {
      if (!this.initialized) {
        logger.warn('Analytics not initialized');
        return;
      }

      const event = {
        eventName,
        eventData,
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        deviceInfo: this._getDeviceInfo()
      };

      this.events.push(event);

      // 如果达到批处理大小，则发送数据
      if (this.events.length >= this.batchSize) {
        this.flush();
      }

    } catch (error) {
      logger.error('Track event failed:', error);
    }
  }

  trackPageView(pageData = {}) {
    this.trackEvent('page_view', {
      path: window.location.pathname,
      title: document.title,
      ...pageData
    });
  }

  trackUserBehavior(behavior) {
    this.trackEvent('user_behavior', {
      type: behavior.type,
      target: behavior.target,
      duration: behavior.duration,
      metadata: behavior.metadata
    });
  }

  async flush(force = false) {
    try {
      if (!this.initialized || (this.events.length === 0 && !force)) {
        return;
      }

      const eventsToSend = [...this.events];
      this.events = [];

      // 发送数据到服务器
      await this._sendToServer(eventsToSend);

    } catch (error) {
      logger.error('Flush analytics data failed:', error);
      // 发送失败时，将事件放回队列
      this.events = [...eventsToSend, ...this.events];
    }
  }

  _generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  _getDeviceInfo() {
    return {
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent,
      language: navigator.language
    };
  }

  async _sendToServer(events) {
    // 实现发送数据到服务器的逻辑
    const response = await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ events })
    });

    if (!response.ok) {
      throw new Error('Failed to send analytics data');
    }

    return response.json();
  }
}

export const analytics = new Analytics();
