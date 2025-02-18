import mongoose from 'mongoose';

const learningActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  type: {
    type: String,
    enum: ['project', 'challenge', 'competition', 'collaboration'],
    required: true
  },

  subject: {
    main: String,
    related: [String]
  },

  competencies: [{
    name: String,
    weight: Number,
    description: String
  }],

  content: {
    description: String,
    objectives: [String],
    requirements: [String],
    resources: [{
      type: String,
      url: String,
      required: Boolean
    }],
    stages: [{
      name: String,
      duration: String,
      tasks: [{
        description: String,
        deadline: Date,
        deliverables: [String]
      }]
    }]
  },

  aiSupport: {
    features: [{
      name: String,
      description: String,
      enabled: Boolean,
      config: mongoose.Schema.Types.Mixed
    }],
    guidance: {
      enabled: Boolean,
      style: String,
      frequency: String
    }
  },

  evaluation: {
    criteria: [{
      name: String,
      weight: Number,
      rubric: [{
        level: String,
        description: String,
        score: Number
      }]
    }],
    peerReview: {
      enabled: Boolean,
      template: String,
      deadline: Date
    }
  },

  collaboration: {
    mode: String,
    maxTeamSize: Number,
    roles: [{
      name: String,
      responsibilities: [String],
      maxMembers: Number
    }]
  },

  schedule: {
    startDate: Date,
    endDate: Date,
    milestones: [{
      date: Date,
      event: String,
      deliverables: [String]
    }]
  },

  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

learningActivitySchema.index({ creator: 1 });
learningActivitySchema.index({ type: 1, status: 1 });
learningActivitySchema.index({ 'schedule.startDate': 1 });

export const LearningActivity = mongoose.model('LearningActivity', learningActivitySchema);
