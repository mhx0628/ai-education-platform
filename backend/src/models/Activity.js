import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    required: true,
    enum: ['exhibition', 'competition', 'project', 'practice']
  },

  // 活动级别
  level: {
    type: String,
    required: true,
    enum: ['class', 'grade', 'school', 'group', 'district', 'city', 'province', 'national', 'international'],
    default: 'class'
  },

  // 活动所属范围
  scope: {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    gradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolGroup' },
    districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District' }
  },

  // 作品类型
  category: {
    type: String,
    required: true,
    enum: ['essay', 'animation', 'video', 'image', 'code', 'comprehensive']
  },

  // 活动时间
  timeline: {
    registration: {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    },
    submission: {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    },
    voting: {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    },
    result: { type: Date, required: true }
  },

  // 投票规则
  votingRules: {
    publicVote: {
      enabled: { type: Boolean, default: true },
      weight: { type: Number, default: 1 }
    },
    expertVote: {
      enabled: { type: Boolean, default: true },
      weight: { type: Number, default: 100 }
    },
    aiEvaluation: {
      enabled: { type: Boolean, default: true },
      weight: { type: Number, default: 50 }
    }
  },

  // 参与统计
  stats: {
    participants: { type: Number, default: 0 },
    submissions: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },

  status: {
    type: String,
    enum: ['draft', 'registration', 'ongoing', 'voting', 'completed'],
    default: 'draft'
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// 索引
activitySchema.index({ level: 1, status: 1 });
activitySchema.index({ 'scope.schoolId': 1 });
activitySchema.index({ 'timeline.registration.start': 1 });
activitySchema.index({ category: 1 });

export const Activity = mongoose.model('Activity', activitySchema);
