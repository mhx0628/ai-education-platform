import mongoose from 'mongoose';

const schoolBrainSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },

  aiModel: {
    name: { type: String, default: 'deepseek-r1' },
    status: { type: String, enum: ['active', 'training', 'updating'] },
    lastUpdated: Date,
    parameters: mongoose.Schema.Types.Mixed
  },

  monitoring: {
    cameras: [{
      location: String,
      status: String,
      lastCheck: Date,
      alerts: [{
        type: String,
        timestamp: Date,
        details: String,
        handled: Boolean
      }]
    }],
    
    attendance: {
      lastSync: Date,
      deviceStatus: [{
        deviceId: String,
        location: String,
        status: String
      }]
    },

    classrooms: [{
      roomId: String,
      currentStatus: {
        occupancy: Number,
        temperature: Number,
        noise: Number,
        airQuality: Number
      },
      recordingStatus: Boolean
    }]
  },

  analytics: {
    realtime: {
      lastUpdate: Date,
      metrics: mongoose.Schema.Types.Mixed
    },
    
    historical: [{
      date: Date,
      metrics: {
        attendance: Number,
        safety: Number,
        learning: Number,
        facility: Number
      }
    }],

    predictions: [{
      type: String,
      prediction: mongoose.Schema.Types.Mixed,
      confidence: Number,
      timestamp: Date
    }]
  },

  alerts: [{
    type: { type: String, enum: ['safety', 'attendance', 'facility', 'academic'] },
    level: { type: String, enum: ['info', 'warning', 'critical'] },
    message: String,
    timestamp: Date,
    status: { type: String, enum: ['new', 'processing', 'resolved'] },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],

  integrations: {
    smartCampus: {
      enabled: Boolean,
      lastSync: Date,
      services: [{
        name: String,
        status: String,
        config: mongoose.Schema.Types.Mixed
      }]
    }
  }
}, {
  timestamps: true
});

schoolBrainSchema.index({ school: 1 });
schoolBrainSchema.index({ 'alerts.status': 1, 'alerts.type': 1 });
schoolBrainSchema.index({ 'monitoring.cameras.alerts.handled': 1 });

export const SchoolBrain = mongoose.model('SchoolBrain', schoolBrainSchema);
