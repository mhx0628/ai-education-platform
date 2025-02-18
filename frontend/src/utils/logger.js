class Logger {
  constructor() {
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };

    this.colors = {
      debug: '#7F7F7F',
      info: '#007FFF',
      warn: '#FF7F00',
      error: '#FF0000'
    };

    this.level = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
  }

  _log(level, message, ...args) {
    if (this.levels[level] >= this.levels[this.level]) {
      const timestamp = new Date().toISOString();
      const prefix = `%c[${timestamp}] [${level.toUpperCase()}]`;
      const style = `color: ${this.colors[level]}; font-weight: bold;`;

      if (args.length > 0) {
        console.log(prefix, style, message, ...args);
      } else {
        console.log(prefix, style, message);
      }

      // 如果是错误级别，保存到错误追踪服务
      if (level === 'error') {
        this._saveError(message, args);
      }
    }
  }

  debug(message, ...args) {
    this._log('debug', message, ...args);
  }

  info(message, ...args) {
    this._log('info', message, ...args);
  }

  warn(message, ...args) {
    this._log('warn', message, ...args);
  }

  error(message, ...args) {
    this._log('error', message, ...args);
  }

  _saveError(message, args) {
    // 实现错误保存逻辑
    const errorLog = {
      message,
      args,
      timestamp: new Date(),
      userInfo: this._getUserInfo(),
      environment: this._getEnvironmentInfo()
    };

    // 可以将错误日志发送到服务器或保存到本地存储
    console.error('Error Log:', errorLog);
  }

  _getUserInfo() {
    // 获取用户信息
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform
    };
  }

  _getEnvironmentInfo() {
    // 获取环境信息
    return {
      env: process.env.NODE_ENV,
      version: process.env.VUE_APP_VERSION,
      buildTime: process.env.VUE_APP_BUILD_TIME
    };
  }
}

export const logger = new Logger();

// 全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
  logger.error('Global Error:', { message, source, lineno, colno, error });
  return false;
};

// Promise错误处理
window.addEventListener('unhandledrejection', event => {
  logger.error('Unhandled Promise Rejection:', event.reason);
});
