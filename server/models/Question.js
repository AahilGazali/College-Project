const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'short-answer', 'long-answer', 'true-false', 'fill-in-blank'],
    required: [true, 'Question type is required']
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: [1, 'Marks must be at least 1']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: [true, 'Difficulty level is required']
  },
  bloomLevel: {
    type: String,
    enum: ['remembering', 'understanding', 'applying', 'analyzing', 'evaluating', 'creating'],
    required: [true, 'Bloom\'s taxonomy level is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  subjectCode: {
    type: String,
    required: [true, 'Subject code is required']
  },
  module: {
    type: String,
    required: [true, 'Module is required']
  },
  courseOutcome: {
    type: String,
    required: [true, 'Course outcome is required']
  },
  options: [{
    text: String,
    isCorrect: Boolean,
    explanation: String
  }],
  correctAnswer: {
    type: String,
    required: function() {
      return ['short-answer', 'long-answer', 'true-false', 'fill-in-blank'].includes(this.type);
    }
  },
  explanation: {
    type: String,
    trim: true
  },
  keywords: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  isTemplate: {
    type: Boolean,
    default: false
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
    estimatedTime: Number, // in minutes
    complexity: String,
    prerequisites: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
questionSchema.index({ subject: 1, subjectCode: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ bloomLevel: 1 });
questionSchema.index({ module: 1 });
questionSchema.index({ createdBy: 1 });
questionSchema.index({ isTemplate: 1 });

// Virtual for question preview
questionSchema.virtual('preview').get(function() {
  return this.question.length > 100 
    ? this.question.substring(0, 100) + '...'
    : this.question;
});

// Method to increment usage count
questionSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

module.exports = mongoose.model('Question', questionSchema);
