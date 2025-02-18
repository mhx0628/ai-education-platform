export const schoolBrainConfig = {
  // 智慧大脑核心配置
  core: {
    model: 'deepseek-r1',
    modelPath: process.env.MODEL_PATH || './models/deepseek',
    maxConcurrentRequests: 10,
    responseTimeout: 30000,
    enableStreamingResponse: true
  },

  // 监控系统集成
  monitoring: {
    dataSources: {
      camera: {
        enabled: true,
        interval: 1000, // 摄像头数据采集间隔(ms)
        retention: '7d' // 数据保留时间
      },
      attendance: {
        enabled: true,
        syncInterval: 300000 // 考勤数据同步间隔
      },
      classroom: {
        enabled: true,
        metrics: ['attention', 'interaction', 'behavior']
      }
    },
    alertRules: {
      safety: {
        priority: 'high',
        response: 'immediate'
      },
      attendance: {
        priority: 'medium',
        threshold: 0.85 // 出勤率警戒线
      },
      behavior: {
        priority: 'medium',
        abnormalDetection: true
      }
    }
  },

  // 数据分析配置
  analytics: {
    realtime: {
      enabled: true,
      metrics: ['attendance', 'safety', 'learning'],
      interval: 60000 // 实时分析间隔
    },
    batch: {
      enabled: true,
      schedule: '0 0 * * *', // 每日分析
      types: ['trend', 'prediction', 'correlation']
    }
  },

  // 智能决策支持
  decisionSupport: {
    areas: ['safety', 'teaching', 'management'],
    analysisDepth: 'comprehensive',
    recommendationEnabled: true,
    riskAssessment: {
      enabled: true,
      levels: ['low', 'medium', 'high', 'critical']
    }
  },

  // 系统集成接口
  integrations: {
    eduManagement: {
      endpoint: process.env.EDU_SYSTEM_URL,
      syncEnabled: true
    },
    smartCampus: {
      endpoint: process.env.SMART_CAMPUS_URL,
      services: ['security', 'facility', 'canteen']
    }
  },

  // AI代理配置
  agents: {
    principal: {
      role: 'school_administrator',
      permissions: ['full_access'],
      capabilities: ['decision_making', 'resource_allocation']
    },
    security: {
      role: 'safety_monitor',
      permissions: ['monitoring', 'alert'],
      capabilities: ['threat_detection', 'emergency_response']
    },
    teaching: {
      role: 'education_analyst',
      permissions: ['data_analysis', 'recommendation'],
      capabilities: ['performance_analysis', 'teaching_optimization']
    }
  }
};
