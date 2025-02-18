import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['research', 'innovation', 'competition', 'survey', 'invention'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  goals: [{
    type: String,
    required: true
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['leader', 'member', 'mentor'],
      default: 'member'
    },
    joinTime: {
      type: Date,
      default: Date.now
    }
  }],
  tasks: [{
    title: String,
    description: String,
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['todo', 'doing', 'done'],
      default: 'todo'
    },
    startDate: Date,
    endDate: Date,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  reports: [{
    title: String,
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    attachments: [{
      name: String,
      url: String,
      type: String
    }],
    createTime: {
      type: Date,
      default: Date.now
    }
  }],
  startDate: Date,
  endDate: Date,
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  tags: [String],
  status: {
    type: String,
    enum: ['planning', 'in_progress', 'completed', 'suspended'],
    default: 'planning'
  },
  aiAssistant: {
    enabled: {
      type: Boolean,
      default: true
    },
    capabilities: [{
      type: String,
      enum: ['planning', 'review', 'analysis', 'suggestion']
    }],
    feedback: [{
      content: String,
      type: String,
      timestamp: Date
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// 虚拟字段：项目进度
projectSchema.virtual('progress').get(function() {
  if (!this.tasks?.length) return 0;
  const completedTasks = this.tasks.filter(task => task.status === 'done').length;
  return Math.round((completedTasks / this.tasks.length) * 100);
});

// 索引
projectSchema.index({ creator: 1, type: 1 });
projectSchema.index({ organization: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ visibility: 1, status: 1 });

export default mongoose.model('Project', projectSchema);
