import mongoose from 'mongoose';

const competitionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['tech_innovation', 'subject', 'ai_creation', 'research', 'maker']
  },
  description: {
    type: String,
    required: true
  },
  rules: {
    type: String,
    required: true
  },
  coverUrl: String,
  enrollStartDate: {
    type: Date,
    required: true
  },
  enrollEndDate: {
    type: Date,
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
  status: {
    type: String,
    enum: ['enrolling', 'in_progress', 'ended'],
    default: 'enrolling'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrollDate: {
      type: Date,
      default: Date.now
    },
    submission: {
      workUrl: String,
      submissionTime: Date,
      score: Number,
      feedback: String
    }
  }],
  awards: {
    type: Map,
    of: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rank: Number,
      prize: String
    }]
  },
  settings: {
    maxParticipants: Number,
    requiresTeam: Boolean,
    teamSize: {
      min: Number,
      max: Number
    },
    judgePanel: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    voteSettings: {
      enablePublicVote: Boolean,
      voteStartDate: Date,
      voteEndDate: Date,
      publicVoteWeight: Number
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// 虚拟字段
competitionSchema.virtual('participantsCount').get(function() {
  return this.participants?.length || 0;
});

// 索引
competitionSchema.index({ type: 1, status: 1 });
competitionSchema.index({ organizer: 1 });
competitionSchema.index({ startDate: -1 });

export default mongoose.model('Competition', competitionSchema);
