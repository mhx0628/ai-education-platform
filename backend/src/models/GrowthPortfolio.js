import mongoose from 'mongoose';

const growthPortfolioSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'semester'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  academic: {
    subjects: [{
      name: String,
      score: Number,
      rank: Number,
      progress: Number,
      strengths: [String],
      weaknesses: [String],
      recommendations: [String]
    }],
    overallGPA: Number,
    learningHours: Number,
    completedTasks: Number
  },
  competencies: {
    cognitive: {
      criticalThinking: Number,
      problemSolving: Number,
      creativity: Number,
      analysis: Number
    },
    social: {
      teamwork: Number,
      communication: Number,
      leadership: Number,
      empathy: Number
    },
    personal: {
      responsibility: Number,
      persistence: Number,
      selfControl: Number,
      motivation: Number
    }
  },
  activities: [{
    type: String,
    name: String,
    role: String,
    achievement: String,
    evaluation: String,
    date: Date
  }],
  works: [{
    type: String,
    title: String,
    description: String,
    url: String,
    feedback: String,
    score: Number,
    createdAt: Date
  }],
  teacherComments: [{
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    type: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  aiEvaluation: {
    summary: String,
    keyFindings: [String],
    recommendations: [String],
    growthCurve: {
      academic: [[Number]], // [时间点, 分数]
      competencies: [[Number]]
    },
    predictiveInsights: {
      shortTerm: String,
      longTerm: String
    }
  }
}, {
  timestamps: true
});

// 索引
growthPortfolioSchema.index({ student: 1, period: 1, startDate: 1 });
growthPortfolioSchema.index({ endDate: 1 });

export default mongoose.model('GrowthPortfolio', growthPortfolioSchema);
