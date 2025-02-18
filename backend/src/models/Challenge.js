import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    enum: ['math', 'chinese', 'english']
  },
  grade: {
    type: String,
    enum: ['grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6', 
           'grade7', 'grade8', 'grade9', 'grade10', 'grade11', 'grade12'],
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  questions: [{
    content: String,
    type: {
      type: String,
      enum: ['choice', 'fill', 'short_answer']
    },
    options: [String],
    answer: mongoose.Schema.Types.Mixed,
    points: {
      type: Number,
      default: 5
    },
    explanation: String,
    hints: [String],
    knowledge: [String], // 知识点标签
    difficulty: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  requirements: {
    timeLimit: Number, // 答题时限（分钟）
    passScore: {
      type: Number,
      default: 60
    },
    maxAttempts: {
      type: Number,
      default: 3
    }
  },
  rewards: {
    experience: Number,
    points: Number,
    badge: {
      type: String,
      enum: ['bronze', 'silver', 'gold']
    }
  },
  aiAssistant: {
    enabled: {
      type: Boolean,
      default: true
    },
    hintStrategy: {
      type: String,
      enum: ['step_by_step', 'concept_based', 'example_based'],
      default: 'step_by_step'
    }
  },
  stats: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageTime: Number
  }
}, {
  timestamps: true
});

// 索引
challengeSchema.index({ subject: 1, level: 1 });
challengeSchema.index({ 'stats.successRate': -1 });

export default mongoose.model('Challenge', challengeSchema);
