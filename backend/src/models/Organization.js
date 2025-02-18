import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['school', 'district', 'institution'],
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  info: {
    address: String,
    phone: String,
    email: String,
    website: String,
    logo: String,
    description: String
  },
  hierarchy: {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
    },
    level: {
      type: Number,
      required: true
    }
  },
  adminSettings: {
    maxUsers: Number,
    allowedFeatures: [String],
    customization: {
      theme: {
        primary: String,
        secondary: String
      },
      modules: [{
        name: String,
        enabled: Boolean
      }]
    }
  },
  aiConfig: {
    modelDeployment: {
      type: String,
      enum: ['cloud', 'local', 'hybrid'],
      default: 'cloud'
    },
    knowledgeBase: {
      enabled: Boolean,
      collections: [{
        name: String,
        description: String,
        accessLevel: String
      }]
    },
    agents: [{
      name: String,
      type: String,
      capabilities: [String],
      status: String
    }]
  },
  dataPrivacy: {
    dataRetentionDays: Number,
    dataSharingAgreements: [{
      organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
      },
      purpose: String,
      startDate: Date,
      endDate: Date,
      status: String
    }],
    encryptionEnabled: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    userCounts: {
      students: Number,
      teachers: Number,
      staff: Number
    },
    resourceUsage: {
      storage: Number,
      apiCalls: Number,
      activeUsers: Number
    },
    activityMetrics: {
      lastUpdate: Date,
      dailyActiveUsers: Number,
      monthlyActiveUsers: Number
    }
  }
}, {
  timestamps: true
});

// 索引
organizationSchema.index({ type: 1, 'hierarchy.level': 1 });
organizationSchema.index({ code: 1 }, { unique: true });
organizationSchema.index({ 'hierarchy.parent': 1 });

export default mongoose.model('Organization', organizationSchema);
