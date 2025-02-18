export const syncConfig = {
  // 数据同步间隔配置
  intervals: {
    realtime: 5000,    // 实时数据同步间隔 (5秒)
    normal: 30000,     // 普通数据同步间隔 (30秒)
    batch: 300000      // 批量数据同步间隔 (5分钟)
  },

  // 同步优先级配置
  priorities: {
    HIGH: 'high',      // 实时同步
    MEDIUM: 'medium',  // 准实时同步
    LOW: 'low'         // 定期同步
  },

  // 本地部署配置
  localDeployment: {
    enabled: process.env.LOCAL_DEPLOYMENT === 'true',
    syncStrategy: 'incremental',
    maxRetries: 3,
    retryDelay: 5000,  // 5秒
    batchSize: 100
  },

  // MaxKB集成配置
  maxkb: {
    syncEnabled: true,
    authStrategy: 'jwt',
    endpointUrl: process.env.MAXKB_URL,
    timeoutMs: 5000
  },

  // 数据类型同步配置
  dataTypes: {
    user: {
      priority: 'high',
      fields: ['profile', 'preferences', 'settings']
    },
    learning: {
      priority: 'medium',
      fields: ['progress', 'submissions', 'evaluations']
    },
    activity: {
      priority: 'medium',
      fields: ['participants', 'submissions', 'votes']
    },
    analytics: {
      priority: 'low',
      fields: ['statistics', 'reports', 'trends']
    }
  },

  // 错误处理配置
  errorHandling: {
    maxRetries: 3,
    retryDelays: [1000, 5000, 15000],
    fallbackStrategy: 'queue'
  }
};
