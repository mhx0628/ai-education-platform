import mongoose from 'mongoose';

const userBehaviorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  sessionId: String,  // 会话标识
  
  behaviors: [{
    type: {
      type: String,
      enum: [
        'ai_interaction',    // AI对话
        'video_watching',    // 视频观看
        'resource_access',   // 资源访问
        'challenge_attempt', // 挑战尝试
        'course_learning',   // 课程学习
        'social_activity',   // 社交活动
        'content_creation'   // 内容创作
      ],
      required: true
    },
    
    timestamp: {
      start: { type: Date, required: true },
      end: Date,
      duration: Number      // 持续时间(秒)
    },

    context: {
      location: {          // 地理位置
        coordinates: [Number],
        address: String
      },
      device: {           // 设备信息
        type: String,
        os: String,
        browser: String
      },
      network: String     // 网络环境
    },

    details: {
      // AI对话相关
      conversation: {
        messages: [{
          role: String,
          content: String,
          timestamp: Date
        }],
        topic: String,
        sentiment: String    // 情感倾向
      },

      // 视频观看相关
      videoInteraction: {
        videoId: String,
        progress: Number,    // 观看进度
        playbackSpeed: Number,
        pauseCount: Number,
        replaySegments: [{
          start: Number,
          end: Number,
          count: Number
        }],
        skipSegments: [{
          start: Number,
          end: Number
        }]
      },

      // 资源访问相关
      resourceAccess: {
        resourceId: String,
        resourceType: String,
        accessPattern: String,
        downloadStatus: Boolean
      },

      // 学习行为相关
      learningBehavior: {
        contentType: String,
        difficulty: String,
        completionStatus: String,
        score: Number,
        mistakes: [{
          type: String,
          frequency: Number
        }]
      }
    },

    aiAnalysis: {
      learningStyle: String,      // 学习风格
      attentionLevel: Number,     // 注意力水平
      comprehensionLevel: Number, // 理解程度
      interestAreas: [String],    // 兴趣领域
      strugglingPoints: [String], // 困难点
      recommendations: [String]   // AI建议
    }
  }], 

  aggregatedMetrics: {
    dailyActiveTime: Number,      // 每日活跃时间
    preferredTimeSlots: [String], // 偏好时间段
    focusSubjects: [{            // 重点关注科目
      subject: String,
      duration: Number,
      frequency: Number
    }],
    learningPatterns: [{         // 学习模式
      pattern: String,
      frequency: Number
    }]
  }
}, {
  timestamps: true
});

// 索引优化
userBehaviorSchema.index({ userId: 1, 'behaviors.timestamp.start': -1 });
userBehaviorSchema.index({ 'behaviors.type': 1 });
userBehaviorSchema.index({ sessionId: 1 });

// 虚拟字段：行为总数
userBehaviorSchema.virtual('totalBehaviors').get(function() {
  return this.behaviors.length;
});

// 数据清理中间件
userBehaviorSchema.pre('save', function(next) {
  // 仅保留最近30天的详细行为数据
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  this.behaviors = this.behaviors.filter(b => 
    b.timestamp.start >= thirtyDaysAgo
  );
  next();
});

export const UserBehavior = mongoose.model('UserBehavior', userBehaviorSchema);
