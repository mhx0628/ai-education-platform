import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: { type: String, required: true },
  description: String,

  content: {
    text: String,          // 文字内容
    files: [{             // 文件内容
      type: String,       // image, video, etc
      url: String,
      thumbnail: String
    }],
    links: [{             // 外部链接
      title: String,
      url: String
    }]
  },

  // AI工具使用记录
  aiTools: [{
    name: String,
    usage: String,
    contribution: String
  }],

  // 评分
  scores: {
    publicVotes: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: Number,
      comment: String,
      timestamp: Date
    }],
    expertScores: [{
      expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      scores: [{
        criterion: String,
        score: Number
      }],
      comment: String,
      timestamp: Date
    }],
    aiEvaluation: {
      overall: Number,
      aspects: [{
        name: String,
        score: Number,
        comment: String
      }]
    }
  },

  stats: {
    totalScore: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    voteCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 }
  },

  status: {
    type: String,
    enum: ['draft', 'submitted', 'reviewing', 'approved', 'rejected'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// 索引
submissionSchema.index({ activityId: 1, status: 1 });
submissionSchema.index({ creator: 1 });
submissionSchema.index({ 'stats.totalScore': -1 });

export const Submission = mongoose.model('Submission', submissionSchema);
