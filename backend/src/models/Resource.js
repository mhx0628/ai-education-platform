import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['video', 'document', 'image', 'audio', 'interactive', 'ai_generated'],
    required: true
  },
  category: {
    type: String,
    enum: ['course', 'exercise', 'reference', 'tool', 'template'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  content: {
    url: String,
    thumbnail: String,
    duration: Number,
    size: Number,
    format: String
  },
  metadata: {
    tags: [String],
    description: String,
    objectives: [String],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    keywords: [String]
  },
  aiFeatures: {
    isAIGenerated: Boolean,
    generationParams: {
      model: String,
      prompt: String,
      settings: mongoose.Schema.Types.Mixed
    },
    enhancement: {
      status: String,
      lastUpdate: Date,
      version: Number
    }
  },
  usage: {
    viewCount: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    favoriteCount: {
      type: Number,
      default: 0
    },
    usageContext: [{
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      useCount: Number,
      lastUsed: Date
    }]
  },
  permissions: {
    visibility: {
      type: String,
      enum: ['private', 'organization', 'public'],
      default: 'private'
    },
    allowDownload: Boolean,
    allowShare: Boolean,
    accessControl: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      permission: {
        type: String,
        enum: ['view', 'edit', 'admin']
      }
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// 索引
resourceSchema.index({ title: 'text', 'metadata.keywords': 'text' });
resourceSchema.index({ type: 1, subject: 1, grade: 1 });
resourceSchema.index({ creator: 1, organization: 1 });
resourceSchema.index({ 'usage.viewCount': -1 });

export default mongoose.model('Resource', resourceSchema);
