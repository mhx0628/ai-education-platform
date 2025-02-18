import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: { type: Number, required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  headTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  students: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    number: Number, // 学号
    joinDate: { type: Date, default: Date.now }
  }],

  subjects: [{
    name: String,
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    schedule: [{
      dayOfWeek: Number,
      period: Number
    }]
  }],

  stats: {
    studentCount: { type: Number, default: 0 },
    averageAttendance: { type: Number, default: 0 },
    aiUsageRate: { type: Number, default: 0 },
    lastAnalysisDate: Date
  },

  activities: [{
    type: { type: String, enum: ['project', 'competition', 'study_group'] },
    name: String,
    startDate: Date,
    endDate: Date,
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['planned', 'ongoing', 'completed'] }
  }]
}, {
  timestamps: true
});

classSchema.index({ schoolId: 1, grade: 1 });
classSchema.index({ 'students.userId': 1 });

export const Class = mongoose.model('Class', classSchema);
