import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'course',       // 课程
      'project',      // 项目式学习
      'assignment',   // 作业
      'article',      // 文章
      'artwork',      // 作品
      'achievement'   // 成就
    ],
    required: true
  },
  format: {
    type: String,
    enum: [
      'text',
      'image',
      'video',
      'audio',
      'document',
      'interactive'
    ],
    required: true
  },
  storage: {
    type: {
      type: String,
      enum: ['minio', 'mongodb', 'local'],
      required: true
    },
    path: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  permissions: {
    visibility: {
      type: String,
      enum: ['public', 'organization', 'private'],
      default: 'private'
    },
    allowedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  tags: [String],
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model('Content', contentSchema);
