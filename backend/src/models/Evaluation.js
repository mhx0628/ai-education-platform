import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  type: {
    type: String,
    enum: ['academic', 'competency', 'activity', 'comprehensive'],
    required: true
  },

  period: {
    term: String,
    startDate: Date,
    endDate: Date
  },

  scores: {
    academic: {
      subjects: [{
        name: String,
        score: Number,
        ranking: Number,
        comments: String
      }],
      overall: {
        average: Number,
        ranking: Number,
        trend: String
      }
    },

    competencies: {
      learning: {
        score: Number,
        details: [{
          aspect: String,
          score: Number,
          evidence: [String]
        }]
      },
      innovation: {
        score: Number,
        projects: [{
          name: String,
          contribution: String,
          evaluation: String
        }]
      },
      teamwork: {
        score: Number,
        activities: [{
          name: String,
          role: String,
          performance: String
        }]
      }
    },

    aiAssessment: {
      strengthPoints: [String],
      weakPoints: [String],
      recommendations: [String],
      potentialAreas: [String]
    }
  },

  growthRecord: {
    highlights: [{
      date: Date,
      category: String,
      description: String,
      significance: String
    }],
    improvements: [{
      area: String,
      baseline: String,
      progress: String,
      nextGoal: String
    }]
  },

  feedback: {
    summary: String,
    suggestions: [String],
    parentComments: String,
    teacherComments: String
  },

  attachments: [{
    type: String,
    url: String,
    description: String
  }],

  status: {
    type: String,
    enum: ['draft', 'submitted', 'reviewed', 'published'],
    default: 'draft'
  }
}, {
  timestamps: true
});

evaluationSchema.index({ student: 1, 'period.term': 1 });
evaluationSchema.index({ evaluator: 1 });
evaluationSchema.index({ type: 1, status: 1 });

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
