import mongoose from 'mongoose';

const learningProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['programming', 'music', 'writing', 'reading', 'speaking', 'art'],
    required: true
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  content: {
    description: String,
    objectives: [String],
    duration: String, // 如 "8w"
    schedule: [{
      week: Number,
      activities: [{
        title: String,
        type: String,
        duration: Number,
        resources: [{
          type: String,
          url: String
        }]
      }]
    }],
    materials: [{
      type: String,
      title: String,
      url: String,
      isRequired: Boolean
    }]
  },

  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    progress: {
      currentWeek: Number,
      completedActivities: [String],
      lastActive: Date
    },
    submissions: [{
      activity: String,
      content: String,
      files: [String],
      feedback: {
        fromAI: String,
        fromMentor: String
      },
      submittedAt: Date
    }]
  }],

  aiSupport: {
    enabled: Boolean,
    assistant: {
      type: String,
      config: mongoose.Schema.Types.Mixed
    },
    features: [{
      name: String,
      description: String,
      endpoint: String
    }]
  },

  evaluation: {
    criteria: [{
      name: String,
      weight: Number,
      description: String
    }],
    milestones: [{
      week: Number,
      requirements: [String],
      evaluation: String
    }]
  },

  settings: {
    visibility: {
      type: String,
      enum: ['public', 'private', 'invited'],
      default: 'public'
    },
    maxParticipants: Number,
    allowLateSubmission: Boolean,
    requireMentorApproval: Boolean
  },

  stats: {
    enrollmentCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    activeParticipants: { type: Number, default: 0 }
  },

  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

learningProjectSchema.index({ category: 1, status: 1 });
learningProjectSchema.index({ creator: 1 });
learningProjectSchema.index({ 'participants.user': 1 });

export const LearningProject = mongoose.model('LearningProject', learningProjectSchema);
