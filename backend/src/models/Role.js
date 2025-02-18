import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  permissions: [{
    resource: {
      type: String,
      required: true
    },
    actions: [{
      type: String,
      enum: ['create', 'read', 'update', 'delete', 'manage']
    }]
  }],

  level: {
    type: Number,
    required: true,
    min: 0
  },

  accessScopes: [{
    type: String,
    enum: [
      'school_wide',
      'district_wide',
      'class_only',
      'self_only',
      'group_only'
    ]
  }],

  aiCapabilities: [{
    feature: String,
    accessLevel: {
      type: String,
      enum: ['full', 'limited', 'none']
    },
    dailyQuota: Number
  }],

  dataAccess: {
    personalData: Boolean,
    academicRecords: Boolean,
    analyticsData: Boolean,
    adminTools: Boolean
  },

  restrictions: {
    requireApproval: [String],
    maxStudents: Number,
    maxClasses: Number
  }
}, {
  timestamps: true
});

// 添加角色层级关系
roleSchema.statics.getRoleHierarchy = function() {
  return {
    system_admin: 100,
    bureau_admin: 90,
    principal: 80,
    teacher: 70,
    parent: 60,
    student: 50
  };
};

export const Role = mongoose.model('Role', roleSchema);
