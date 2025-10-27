const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Paper title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  subjectCode: {
    type: String,
    required: [true, 'Subject code is required'],
    trim: true
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks are required'],
    min: [1, 'Total marks must be at least 1']
  },
  examDuration: {
    type: Number,
    required: [true, 'Exam duration is required'],
    min: [1, 'Duration must be at least 1 hour']
  },
  instructions: {
    type: String,
    trim: true,
    maxlength: [2000, 'Instructions cannot exceed 2000 characters']
  },
  sections: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    marksPerQuestion: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    questionsToAnswer: {
      type: Number,
      required: true
    },
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    }],
    order: {
      type: Number,
      default: 0
    }
  }],
  courseOutcomes: [{
    type: String,
    required: true
  }],
  modules: [{
    type: String,
    required: true
  }],
  difficultyDistribution: {
    easy: {
      type: Number,
      default: 0
    },
    medium: {
      type: Number,
      default: 0
    },
    hard: {
      type: Number,
      default: 0
    }
  },
  bloomDistribution: {
    remembering: {
      type: Number,
      default: 0
    },
    understanding: {
      type: Number,
      default: 0
    },
    applying: {
      type: Number,
      default: 0
    },
    analyzing: {
      type: Number,
      default: 0
    },
    evaluating: {
      type: Number,
      default: 0
    },
    creating: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'approved', 'published', 'archived'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewComments: [{
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  version: {
    type: Number,
    default: 1
  },
  parentPaper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionPaper',
    default: null
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateName: {
    type: String,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    generatedBy: {
      type: String,
      enum: ['manual', 'ai', 'template'],
      default: 'manual'
    },
    generationTime: Number, // in seconds
    complexity: String,
    coverage: Number // percentage
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
questionPaperSchema.index({ createdBy: 1 });
questionPaperSchema.index({ subject: 1, subjectCode: 1 });
questionPaperSchema.index({ status: 1 });
questionPaperSchema.index({ createdAt: -1 });
questionPaperSchema.index({ isTemplate: 1 });

// Virtual for total questions count
questionPaperSchema.virtual('totalQuestions').get(function() {
  return this.sections.reduce((total, section) => total + section.totalQuestions, 0);
});

// Virtual for answered questions count
questionPaperSchema.virtual('questionsToAnswer').get(function() {
  return this.sections.reduce((total, section) => total + section.questionsToAnswer, 0);
});

// Virtual for completion percentage
questionPaperSchema.virtual('completionPercentage').get(function() {
  if (this.sections.length === 0) return 0;
  const totalQuestions = this.totalQuestions;
  const answeredQuestions = this.questionsToAnswer;
  return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
});

// Method to add review comment
questionPaperSchema.methods.addReviewComment = function(reviewerId, comment) {
  this.reviewComments.push({
    reviewer: reviewerId,
    comment: comment,
    createdAt: new Date()
  });
  return this.save();
};

// Method to update status
questionPaperSchema.methods.updateStatus = function(newStatus, userId) {
  this.status = newStatus;
  
  if (newStatus === 'reviewed') {
    this.reviewedBy = userId;
  } else if (newStatus === 'approved') {
    this.approvedBy = userId;
  }
  
  return this.save();
};

// Method to create new version
questionPaperSchema.methods.createNewVersion = function() {
  const newVersion = this.toObject();
  delete newVersion._id;
  delete newVersion.createdAt;
  delete newVersion.updatedAt;
  newVersion.version = this.version + 1;
  newVersion.parentPaper = this._id;
  newVersion.status = 'draft';
  
  return this.constructor.create(newVersion);
};

// Method to increment usage count
questionPaperSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

module.exports = mongoose.model('QuestionPaper', questionPaperSchema);
