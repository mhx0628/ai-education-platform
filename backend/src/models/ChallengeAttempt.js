import mongoose from 'mongoose';

const challengeAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  answers: [{
    questionIndex: Number,
    answer: String,
    isCorrect: Boolean,
    timeTaken: Number,  // 答题用时(秒)
    attempts: Number    // 该题尝试次数
  }],
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'failed'],
    default: 'in_progress'
  },
  score: Number,
  startTime: Date,
  endTime: Date,
  aiRecommendations: {
    weakPoints: [String],
    studyPlan: String,
    practiceQuestions: [{
      content: String,
      difficulty: Number
    }]
  }
}, { timestamps: true });

export default mongoose.model('ChallengeAttempt', challengeAttemptSchema);
