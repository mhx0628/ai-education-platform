import mongoose from 'mongoose';

const aiAssistantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['teacher', 'student', 'principal', 'parent'],
    required: true
  },

  personality: {
    supportiveness: { type: Number, min: 0, max: 1, default: 0.8 },
    patience: { type: Number, min: 0, max: 1, default: 0.9 },
    guidance: { type: Number, min: 0, max: 1, default: 0.7 }
  },

  capabilities: [{
    name: String,
    enabled: Boolean,
    config: mongoose.Schema.Types.Mixed
  }],

  conversation: {
    memory: { type: Number, default: 10 }, // 记忆轮次
    contextAwareness: Boolean,
    followupQuestions: Boolean
  },

  teachingStyle: {
    socratic: Boolean, // 苏格拉底式提问
    constructivist: Boolean, // 建构主义
    scaffolding: Boolean // 支架式教学
  },

  customPrompts: [{
    scenario: String,
    template: String,
    variables: [String]
  }],

  modelConfig: {
    baseModel: String,
    temperature: Number,
    maxTokens: Number,
    topP: Number
  }
}, {
  timestamps: true
});

export const AIAssistant = mongoose.model('AIAssistant', aiAssistantSchema);
