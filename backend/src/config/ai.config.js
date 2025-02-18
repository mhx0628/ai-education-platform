export const aiConfig = {
  // DeepSeek配置
  deepseek: {
    apiUrl: process.env.DEEPSEEK_API_URL,
    apiKey: process.env.DEEPSEEK_API_KEY,
    models: {
      default: 'deepseek-chat',
      coding: 'deepseek-coder',
      math: 'deepseek-math'
    },
    maxRetries: 3,
    timeout: 30000,
    streaming: true
  },

  // MaxKB配置
  maxkb: {
    endpoint: process.env.MAXKB_ENDPOINT,
    apiKey: process.env.MAXKB_API_KEY,
    collections: {
      default: 'general_kb',
      education: 'edu_kb',
      course: 'course_kb'
    },
    agents: {
      teacher: {
        role: 'teacher_assistant',
        capabilities: ['lesson_planning', 'evaluation']
      },
      student: {
        role: 'learning_guide',
        capabilities: ['tutoring', 'exercise_generation']
      }
    }
  },

  // AI角色配置
  roles: {
    teacherAssistant: {
      systemPrompt: '你是一位专业的教师助手，擅长教案设计和教学指导。',
      temperature: 0.7,
      maxTokens: 2000
    },
    studentGuide: {
      systemPrompt: '你是一位耐心的学习引导者，注重启发式教学。',
      temperature: 0.8,
      maxTokens: 1500
    },
    evaluator: {
      systemPrompt: '你是一位客观的评估专家，注重全面分析。',
      temperature: 0.3,
      maxTokens: 1000
    }
  },

  // 内容安全配置
  contentSafety: {
    enabled: true,
    filters: ['sensitive', 'violent', 'political'],
    moderationThreshold: 0.8,
    autoReject: true
  },

  // AI响应策略
  responseStrategy: {
    teaching: {
      style: 'socratic',
      shouldProvideAnswer: false,
      focusOnProcess: true
    },
    evaluation: {
      style: 'constructive',
      includeRecommendations: true,
      detailLevel: 'comprehensive'
    }
  }
};

// AI提示词模板
export const promptTemplates = {
  lessonPlanning: `
角色：专业教师助手
任务：设计教案
考虑因素：
- 教学目标
- 学生水平
- 教学方法
- 课程难度
请基于以下信息设计教案：
{context}
  `,
  
  studentGuidance: `
角色：学习引导者
任务：解答问题
原则：
- 不直接提供答案
- 启发式引导
- 强调思维过程
- 鼓励独立思考
问题信息：
{context}
  `,
  
  evaluation: `
角色：评估专家
任务：作业评估
评估维度：
- 知识掌握
- 思维方法
- 创新能力
- 表达能力
作业内容：
{context}
  `
};
