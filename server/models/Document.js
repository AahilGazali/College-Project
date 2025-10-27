const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['syllabus', 'pyq', 'reference'],
    required: [true, 'Document type is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  subjectCode: {
    type: String,
    trim: true
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  originalName: {
    type: String,
    required: [true, 'Original file name is required']
  },
  filePath: {
    type: String,
    required: false // Made optional since we'll use driveLink
  },
  driveLink: {
    type: String,
    required: false // Google Drive shareable link
  },
  driveFileId: {
    type: String,
    required: false // Google Drive file ID for management
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  extractedText: {
    type: String,
    default: null
  },
  topics: [{
    name: String,
    confidence: Number,
    extractedAt: {
      type: Date,
      default: Date.now
    }
  }],
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingError: {
    type: String,
    default: null
  },
  metadata: {
    pageCount: Number,
    wordCount: Number,
    language: String,
    extractedAt: Date
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ type: 1 });
documentSchema.index({ subject: 1 });
documentSchema.index({ processingStatus: 1 });
documentSchema.index({ createdAt: -1 });

// Virtual for file URL
documentSchema.virtual('fileUrl').get(function() {
  return `/api/documents/${this._id}/download`;
});

// Virtual for processing progress
documentSchema.virtual('processingProgress').get(function() {
  switch (this.processingStatus) {
    case 'pending': return 0;
    case 'processing': return 50;
    case 'completed': return 100;
    case 'failed': return 0;
    default: return 0;
  }
});

// Method to extract topics from text
documentSchema.methods.extractTopics = function() {
  if (!this.extractedText) return [];
  
  // Simple topic extraction (can be enhanced with NLP)
  const words = this.extractedText.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({
      name,
      confidence: Math.min(count / words.length * 100, 100),
      extractedAt: new Date()
    }));
};

module.exports = mongoose.model('Document', documentSchema);
