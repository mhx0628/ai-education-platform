import mongoose from 'mongoose';

// 预留的集团校模型，后续迭代时使用
const schoolGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  
  headquarter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },

  members: [{
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    joinDate: { type: Date, default: Date.now }
  }],

  administrators: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['group_principal', 'admin'] },
    permissions: [String]
  }],

  districts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District'
  }],

  stats: {
    totalStudents: Number,
    totalTeachers: Number,
    totalClasses: Number,
    lastUpdated: Date
  }
}, {
  timestamps: true
});

schoolGroupSchema.index({ 'members.school': 1 });
schoolGroupSchema.index({ districts: 1 });

export const SchoolGroup = mongoose.model('SchoolGroup', schoolGroupSchema);
