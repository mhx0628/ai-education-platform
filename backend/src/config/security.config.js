export const securityConfig = {
  // 认证配置
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h',
      refreshToken: {
        enabled: true,
        expiresIn: '7d'
      }
    },
    session: {
      enabled: true,
      maxAge: 86400000, // 24小时
      secure: process.env.NODE_ENV === 'production'
    },
    passwordPolicy: {
      minLength: 8,
      requireNumbers: true,
      requireLetters: true,
      requireSymbols: true
    }
  },

  // 权限控制
  rbac: {
    roles: ['admin', 'principal', 'teacher', 'student', 'parent'],
    permissions: {
      admin: ['all'],
      principal: ['school_manage', 'data_analysis', 'teacher_manage'],
      teacher: ['course_manage', 'student_manage', 'content_create'],
      student: ['learn', 'submit', 'interact'],
      parent: ['view', 'communicate']
    }
  },

  // 内容审核
  contentModeration: {
    enabled: true,
    ai: {
      model: 'content-filter-v1',
      threshold: 0.8,
      categories: ['sensitive', 'violent', 'inappropriate']
    },
    humanReview: {
      enabled: true,
      queueSize: 1000,
      reviewTimeout: 86400 // 24小时审核期限
    }
  },

  // 数据安全
  dataSecurity: {
    encryption: {
      algorithm: 'aes-256-gcm',
      keyRotation: true,
      rotationPeriod: '30d'
    },
    backup: {
      enabled: true,
      schedule: '0 0 * * *', // 每日备份
      retention: '90d'
    },
    privacy: {
      pii: {
        fields: ['phone', 'email', 'address'],
        encryption: true,
        masking: true
      },
      dataRetention: {
        enabled: true,
        period: '365d'
      }
    }
  },

  // 攻击防护
  protection: {
    rateLimit: {
      window: 900000, // 15分钟
      max: 1000, // 最大请求数
      blockDuration: 3600000 // 封禁1小时
    },
    ddos: {
      enabled: true,
      threshold: 10000, // 请求阈值
      blockTime: 3600 // 封禁时间(秒)
    },
    xss: {
      enabled: true,
      mode: 'block'
    },
    csrf: {
      enabled: true,
      tokens: true
    }
  },

  // 审计日志
  audit: {
    enabled: true,
    events: ['login', 'data_access', 'content_moderation'],
    retention: '180d',
    alerting: {
      enabled: true,
      triggers: ['unauthorized_access', 'suspicious_activity']
    }
  }
};
