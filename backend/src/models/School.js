import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
  
  // 为后续集团校功能预留的字段
  isGroupMember: { type: Boolean, default: false },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolGroup' },
  isHeadquarter: { type: Boolean, default: false },
  
  address: {
    province: String,
    city: String,
    district: String,
    detail: String
  },
  
  stats: {
    studentCount: Number,
    teacherCount: Number,
    classCount: Number,
    aiUsageRate: Number,
    lastUpdated: Date
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },

  principals: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['principal', 'vice_principal'] },
    permissions: [String]
  }]
}, {
  timestamps: true
});

// 添加索引
schoolSchema.index({ district: 1 });
schoolSchema.index({ 'stats.lastUpdated': -1 });
schoolSchema.index({ isGroupMember: 1, groupId: 1 });

export const School = mongoose.model('School', schoolSchema);
