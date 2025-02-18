import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['class', 'school', 'interest', 'project'],
    required: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinDate: { type: Date, default: Date.now }
  }],

  content: {
    description: String,
    rules: [String],
    announcement: String,
    tags: [String]
  },

  discussions: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    content: String,
    attachments: [{
      type: String,
      url: String,
      format: String
    }],
    comments: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: String,
      createdAt: { type: Date, default: Date.now }
    }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    aiAnalysis: {
      topics: [String],
      sentiment: String,
      quality: Number
    },
    createdAt: { type: Date, default: Date.now }
  }],

  activities: [{
    type: { type: String, enum: ['event', 'challenge', 'collaboration'] },
    title: String,
    description: String,
    startDate: Date,
    endDate: Date,
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],

  resources: [{
    title: String,
    type: String,
    url: String,
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    downloads: { type: Number, default: 0 },
    aiTags: [String]
  }],

  settings: {
    visibility: {
      type: String,
      enum: ['public', 'private', 'invite_only'],
      default: 'public'
    },
    joinApproval: Boolean,
    allowDiscussions: Boolean,
    aiModeration: {
      enabled: Boolean,
      sensitivity: {
        type: String,
        enum: ['low', 'medium', 'high']
      }
    }
  },

  stats: {
    memberCount: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    lastActive: Date
  }
}, {
  timestamps: true
});

communitySchema.index({ type: 1, 'settings.visibility': 1 });
communitySchema.index({ 'members.user': 1 });
communitySchema.index({ 'discussions.createdAt': -1 });

export const Community = mongoose.model('Community', communitySchema);
