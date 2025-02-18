import mongoose from 'mongoose';

const showcaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }
  },

  category: {
    type: String,
    enum: [
      'ai_artwork',
      'ai_composition',
      'ai_programming',
      'ai_research',
      'ai_innovation'
    ],
    required: true
  },

  content: {
    description: String,
    creationProcess: String,
    aiTools: [{
      name: String,
      usage: String,
      contribution: String
    }],
    files: [{
      type: String,
      url: String,
      thumbnail: String,
      format: String
    }],
    tags: [String]
  },

  aiAnalysis: {
    creativity: {
      score: Number,
      highlights: [String]
    },
    technique: {
      score: Number,
      evaluation: String
    },
    originality: {
      score: Number,
      uniquePoints: [String]
    }
  },

  feedback: {
    comments: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: String,
      rating: Number,
      createdAt: { type: Date, default: Date.now }
    }],
    expertReviews: [{
      expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      review: String,
      score: Number,
      aspects: [{
        name: String,
        score: Number,
        comment: String
      }]
    }]
  },

  visibility: {
    type: String,
    enum: ['public', 'school', 'private'],
    default: 'public'
  },

  permissions: {
    allowComments: { type: Boolean, default: true },
    allowSharing: { type: Boolean, default: true },
    allowDownload: { type: Boolean, default: false }
  },

  stats: {
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shares: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }
  },

  featured: {
    isFeatured: { type: Boolean, default: false },
    startDate: Date,
    endDate: Date,
    reason: String
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'featured', 'archived'],
    default: 'pending'
  }
}, {
  timestamps: true
});

showcaseSchema.index({ category: 1, status: 1 });
showcaseSchema.index({ 'creator.user': 1 });
showcaseSchema.index({ 'creator.school': 1 });
showcaseSchema.index({ 'stats.likes': 1 });

export const Showcase = mongoose.model('Showcase', showcaseSchema);
