import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  code: {
    type: String,
    required: true,
    unique: true
  },

  description: String,

  type: {
    type: String,
    enum: ['operation', 'data', 'menu', 'api'],
    required: true
  },

  resource: {
    type: String,
    required: true
  },

  action: {
    type: String,
    enum: ['create', 'read', 'update', 'delete', 'manage', 'execute'],
    required: true
  },

  conditions: [{
    field: String,
    operator: String,
    value: mongoose.Schema.Types.Mixed
  }],

  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],

  metadata: {
    platform: [String],
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    auditRequired: Boolean
  }
}, {
  timestamps: true
});

permissionSchema.index({ code: 1 });
permissionSchema.index({ type: 1, resource: 1, action: 1 });

export const Permission = mongoose.model('Permission', permissionSchema);
