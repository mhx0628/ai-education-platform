import mongoose from 'mongoose';

const learningRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  recordType: {
    type: String,
    enum: ['course', 'challenge', 'project', 'activity'],
    required: true
  },

  content: {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
    score: Number,
    progress: Number,
    aiAnalysis: {
      strengths: [String],
      weaknesses: [String],
      recommendations: [String]
    }
  },

  competencies: {
    learning: Number,
    innovation: Number,
    teamwork: Number,
    problemSolving: Number,
    selfStudy: Number
  },

  aiInteractions: [{
    timestamp: Date,
    type: String,
    question: String,
    response: String,
    helpfulness: Number
  }],

  timestamps: {
    start: { type: Date, required: true },
    end: Date,
    duration: Number // 分钟
  },

  // 杜威十进制分类法标签
  tags: [{
    code: String,
    name: String,
    level: Number
  }]
}, {
  timestamps: true
});

learningRecordSchema.index({ student: 1, 'timestamps.start': -1 });
learningRecordSchema.index({ 'tags.code': 1 });

export const LearningRecord = mongoose.model('LearningRecord', learningRecordSchema);
