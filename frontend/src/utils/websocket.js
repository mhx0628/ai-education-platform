import { logger } from './logger';
import { authService } from './auth';
import { EventEmitter } from 'events';

class WebSocketClient extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = {
      url: process.env.VUE_APP_WS_URL,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      pingInterval: 30000,
      ...options
    };

    this.connected = false;
    this.reconnectAttempts = 0;
    this.messageQueue = [];
    this.handlers = new Map();
    
    this.init();
  }

  init() {
    this.connect();
    this.setupPing();
  }

  connect() {
    try {
      const token = authService.getToken();
      const url = `${this.options.url}?token=${token}`;
      
      this.ws = new WebSocket(url);
      this.bindEvents();
    } catch (error) {
      logger.error('WebSocket connection failed:', error);
      this.handleConnectionError();
    }
  }

  bindEvents() {
    this.ws.onopen = () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      this.emit('connected');
      this.flushMessageQueue();
      logger.info('WebSocket connected');
    };

    this.ws.onclose = () => {
      this.connected = false;
      this.emit('disconnected');
      this.handleConnectionError();
      logger.warn('WebSocket disconnected');
    };

    this.ws.onerror = (error) => {
      logger.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        logger.error('Failed to parse WebSocket message:', error);
      }
    };
  }

  handleMessage(message) {
    const { type, data } = message;
    
    // 处理系统消息
    if (type === 'system') {
      this.handleSystemMessage(data);
      return;
    }

    // 处理业务消息
    const handler = this.handlers.get(type);
    if (handler) {
      handler(data);
    }

    this.emit('message', message);
  }

  send(type, data) {
    const message = JSON.stringify({ type, data });
    
    if (this.connected) {
      this.ws.send(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  registerHandler(type, handler) {
    this.handlers.set(type, handler);
  }

  unregisterHandler(type) {
    this.handlers.delete(type);
  }

  private handleConnectionError() {
    if (this.reconnectAttempts < this.options.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        logger.info(`Attempting to reconnect (${this.reconnectAttempts})`);
        this.connect();
      }, this.options.reconnectInterval);
    } else {
      this.emit('max_reconnect_attempts');
      logger.error('Max reconnection attempts reached');
    }
  }

  private setupPing() {
    setInterval(() => {
      if (this.connected) {
        this.send('ping', { timestamp: Date.now() });
      }
    }, this.options.pingInterval);
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.ws.send(message);
    }
  }

  private handleSystemMessage(data) {
    switch (data.action) {
      case 'refresh_token':
        authService.refreshToken();
        break;
      case 'force_logout':
        authService.logout();
        break;
      default:
        logger.warn('Unknown system message:', data);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const wsClient = new WebSocketClient();
