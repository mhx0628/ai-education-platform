import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  grade: { type: Number, required: true },
  
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },

  content: {
    description: String,
    objectives: [String],
    prerequisites: [String],
    syllabus: [{
      title: String,
      description: String,
      resources: [{
        type: String,
        url: String,
        format: String
      }]
    }],
    aiGenerated: {
      lessonPlan: String,
      materials: [String],
      exercises: [String]
    }
  },

  settings: {
    visibility: {
      type: String,
      enum: ['public', 'school', 'private'],
      default: 'school'
    },
    enrollmentType: {
      type: String,
      enum: ['open', 'approval', 'invited'],
      default: 'open'
    },
    aiAssistant: {
      enabled: { type: Boolean, default: true },
      features: [String]
    }
  },

  stats: {
    enrollmentCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    aiUsageCount: { type: Number, default: 0 }
  },

  tags: [String],
  
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

courseSchema.index({ subject: 1, grade: 1 });
courseSchema.index({ school: 1 });
courseSchema.index({ 'settings.visibility': 1 });

export const Course = mongoose.model('Course', courseSchema);
