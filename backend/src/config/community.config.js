export const communityConfig = {
  // 社区基础配置
  basic: {
    pageSize: 20,
    maxPostLength: 10000,
    maxCommentLength: 1000,
    maxTagsPerPost: 5,
    maxAttachmentsPerPost: 10
  },

  // 学习项目配置
  learningProjects: {
    categories: [
      'programming',
      'music',
      'writing',
      'reading',
      'speaking',
      'art'
    ],
    defaultDuration: '8w',
    progressTracking: true,
    aiAssistant: {
      enabled: true,
      interactionMode: 'chat',
      responseStyle: 'encouraging'
    }
  },

  // 闯关系统配置
  challenges: {
    subjects: ['math', 'chinese', 'english'],
    levelsPerGrade: 20,
    questionsPerLevel: {
      elementary: 10,
      junior: 20,
      senior: 40
    },
    retryLimit: 3,
    aiGuidance: {
      enabled: true,
      style: 'socratic',
      hintLevels: ['subtle', 'moderate', 'detailed']
    }
  },

  // 内容管理
  contentManagement: {
    moderation: {
      autoModeration: true,
      humanReview: true,
      aiFilter: {
        enabled: true,
        sensitivity: 'medium'
      }
    },
    rewards: {
      points: {
        post: 10,
        comment: 2,
        quality: 20
      },
      badges: {
        enabled: true,
        categories: ['creator', 'helper', 'expert']
      }
    }
  },

  // 互动功能
  interaction: {
    voting: {
      enabled: true,
      weightRules: {
        public: 1,
        expert: 100
      }
    },
    comments: {
      nested: true,
      maxDepth: 3,
      sortBy: 'hot'
    },
    sharing: {
      platforms: ['wechat', 'qq', 'weibo'],
      tracking: true
    }
  },

  // 活动系统
  events: {
    types: ['competition', 'workshop', 'showcase'],
    registration: {
      requireApproval: false,
      maxParticipants: 200
    },
    voting: {
      duration: '7d',
      publicVoting: true,
      expertVoting: true
    }
  }
};
