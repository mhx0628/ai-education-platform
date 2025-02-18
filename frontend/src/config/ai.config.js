export const AIModelConfig = {
  // 基础模型配置
  baseModel: 'deepseek-r1',
  endpoint: process.env.VUE_APP_AI_ENDPOINT,
  maxContextLength: 20,

  // 教学相关配置
  teaching: {
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
    frequencyPenalty: 0.5,
    presencePenalty: 0.5,
    stopSequences: ['###'],
    templates: {
      lessonPlan: '创建一个针对{grade}年级{subject}的教案，主题是{topic}...',
      courseware: '为{topic}创建一个PPT大纲，包含以下要点...',
      exercise: '生成一套{difficulty}难度的{subject}练习题，包含{count}道题...'
    }
  },

  // 学习辅导配置
  guidance: {
    style: 'socratic',  // 苏格拉底式问答
    temperature: 0.8,
    maxTokens: 1000,
    promptPresets: {
      problemSolving: '让我们一步步思考这个问题...',
      conceptExplanation: '这个概念可以通过以下例子来理解...',
      skillPractice: '让我们通过练习来掌握这个技能...'
    }
  },

  // 评估反馈配置
  assessment: {
    dimensions: [
      'knowledge_mastery',
      'critical_thinking',
      'creativity',
      'learning_attitude'
    ],
    criteria: {
      knowledge_mastery: {
        weight: 0.4,
        metrics: ['accuracy', 'comprehension', 'application']
      },
      critical_thinking: {
        weight: 0.3,
        metrics: ['analysis', 'evaluation', 'reasoning']
      }
    },
    feedbackStyle: {
      tone: 'encouraging',
      format: 'structured',
      includeActionItems: true
    }
  },

  // 安全和审核配置
  safety: {
    contentFiltering: true,
    sensitiveTopics: ['politics', 'religion', 'discrimination'],
    moderationLevel: 'strict',
    maxRetries: 3
  },

  // 性能优化配置
  performance: {
    cacheEnabled: true,
    cacheTTL: 3600,
    batchSize: 10,
    timeout: 30000
  }
};

// AI助手角色配置
export const AIAssistantRoles = {
  teacher: {
    name: '教学助手',
    capabilities: ['lesson_planning', 'content_creation', 'assessment'],
    personality: {
      professional: 0.9,
      supportive: 0.8,
      patient: 0.9
    }
  },
  student: {
    name: '学习伙伴',
    capabilities: ['question_answering', 'practice_guidance', 'study_planning'],
    personality: {
      friendly: 0.9,
      encouraging: 0.8,
      adaptive: 0.7
    }
  },
  parent: {
    name: '家庭顾问',
    capabilities: ['progress_tracking', 'advice_giving', 'resource_recommendation'],
    personality: {
      empathetic: 0.9,
      informative: 0.8,
      constructive: 0.8
    }
  }
};
