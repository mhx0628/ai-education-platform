import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'teacher', 'parent', 'principal', 'admin'],
    required: true
  },
  profile: {
    realName: String,
    avatar: String,
    phone: String,
    email: String,
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const User = mongoose.model('User', userSchema);
