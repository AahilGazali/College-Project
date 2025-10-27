const express = require('express');
const { body, validationResult, query } = require('express-validator');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const { authenticateToken, authorize } = require('../middleware/auth');
const { upload, uploadToCloudStorage, handleMulterError } = require('../middleware/cloudStorage');
const { extractTextFromFile } = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/documents/upload
// @desc    Upload documents
// @access  Private
router.post('/upload', [
  authenticateToken,
  upload.array('files', 5),
  uploadToCloudStorage,
  handleMulterError,
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('type').isIn(['syllabus', 'pyq', 'reference']).withMessage('Type must be syllabus, pyq, or reference'),
  body('subject').trim().isLength({ min: 1 }).withMessage('Subject is required'),
  body('subjectCode').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No files uploaded'
      });
    }

    const { title, description, type, subject, subjectCode, tags } = req.body;
    const uploadedDocuments = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const uploadedFile = req.uploadedFiles[i];

      const document = new Document({
        title: title || path.parse(file.originalname).name,
        description: description || '',
        type,
        subject,
        subjectCode: subjectCode || '',
        fileName: uploadedFile.fileName,
        originalName: uploadedFile.originalName,
        filePath: uploadedFile.driveLink ? null : file.path, // Use local path only if drive upload failed
        driveLink: uploadedFile.driveLink,
        driveFileId: uploadedFile.driveFileId,
        fileSize: uploadedFile.fileSize,
        mimeType: uploadedFile.mimeType,
        uploadedBy: req.user._id,
        extractedText: '', // Will be populated by text extraction
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        processingStatus: 'pending'
      });

      await document.save();
      uploadedDocuments.push(document);
    }

    res.status(201).json({
      message: 'Documents uploaded successfully',
      documents: uploadedDocuments
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      message: 'Document upload failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/documents
// @desc    Get user's documents
// @access  Private
router.get('/', [
  authenticateToken,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['syllabus', 'pyq', 'reference']).withMessage('Type must be syllabus, pyq, or reference'),
  query('subject').optional().trim(),
  query('search').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { type, subject, search } = req.query;

    // Build filter object
    const filter = { uploadedBy: req.user._id };
    if (type) filter.type = type;
    if (subject) filter.subject = new RegExp(subject, 'i');
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { extractedText: { $regex: search, $options: 'i' } }
      ];
    }

    // Get documents with pagination
    const documents = await Document.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Document.countDocuments(filter);

    res.json({
      documents,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      message: 'Failed to fetch documents',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/documents/:id
// @desc    Get document by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id)
      .populate('uploadedBy', 'name email');

    if (!document) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }

    // Check if user has access to this document
    if (req.user.role !== 'admin' && document.uploadedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only view your own documents.'
      });
    }

    res.json({ document });

  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      message: 'Failed to fetch document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/documents/:id
// @desc    Update document
// @access  Private
router.put('/:id', [
  authenticateToken,
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('subject').optional().trim(),
  body('subjectCode').optional().trim(),
  body('tags').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { title, description, subject, subjectCode, tags } = req.body;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }

    // Check if user has access to this document
    if (req.user.role !== 'admin' && document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only update your own documents.'
      });
    }

    // Update document
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (subject) updateData.subject = subject;
    if (subjectCode !== undefined) updateData.subjectCode = subjectCode;
    if (tags) updateData.tags = tags.split(',').map(tag => tag.trim());

    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name email');

    res.json({
      message: 'Document updated successfully',
      document: updatedDocument
    });

  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({
      message: 'Failed to update document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete document
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }

    // Check if user has access to this document
    if (req.user.role !== 'admin' && document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only delete your own documents.'
      });
    }

    // Delete file from Google Drive if it exists
    if (document.driveFileId) {
      try {
        const googleDriveService = require('../services/googleDriveService');
        await googleDriveService.deleteFile(document.driveFileId);
        console.log(`✅ Deleted file ${document.driveFileId} from Google Drive`);
      } catch (driveError) {
        console.error('Failed to delete file from Google Drive:', driveError);
        // Continue with database deletion even if drive deletion fails
      }
    }

    // Delete local file if it exists
    if (document.filePath) {
      try {
        if (fs.existsSync(document.filePath)) {
          fs.unlinkSync(document.filePath);
          console.log(`✅ Deleted local file ${document.filePath}`);
        }
      } catch (fileError) {
        console.error('File deletion error:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete document from database
    await Document.findByIdAndDelete(id);

    res.json({
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      message: 'Failed to delete document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/documents/:id/download
// @desc    Download document
// @access  Private
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }

    // Check if user has access to this document
    if (req.user.role !== 'admin' && document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only download your own documents.'
      });
    }

    // If document has a drive link, redirect to it
    if (document.driveLink) {
      return res.redirect(document.driveLink);
    }

    // Fallback to local file if drive link is not available
    if (!document.filePath || !fs.existsSync(document.filePath)) {
      return res.status(404).json({
        message: 'File not found on server'
      });
    }

    // Set appropriate headers for local file
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Length', document.fileSize);

    // Stream the file
    const fileStream = fs.createReadStream(document.filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({
      message: 'Failed to download document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/documents/:id/process
// @desc    Process document for text extraction
// @access  Private
router.post('/:id/process', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }

    // Check if user has access to this document
    if (req.user.role !== 'admin' && document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only process your own documents.'
      });
    }

    // Update processing status
    document.processingStatus = 'processing';
    await document.save();

    // Simulate processing (in real implementation, you would use OCR services)
    setTimeout(async () => {
      try {
        // Extract text based on file type
        let extractedText = '';
        
        if (document.mimeType === 'application/pdf') {
          const pdfParse = require('pdf-parse');
          const fs = require('fs');
          const dataBuffer = fs.readFileSync(document.filePath);
          const data = await pdfParse(dataBuffer);
          extractedText = data.text;
        } else if (document.mimeType.startsWith('text/')) {
          extractedText = fs.readFileSync(document.filePath, 'utf8');
        }

        // Update document with extracted text and topics
        document.extractedText = extractedText;
        document.topics = document.extractTopics();
        document.processingStatus = 'completed';
        document.metadata = {
          wordCount: extractedText.split(/\s+/).length,
          extractedAt: new Date()
        };

        await document.save();
      } catch (processingError) {
        console.error('Document processing error:', processingError);
        document.processingStatus = 'failed';
        document.processingError = processingError.message;
        await document.save();
      }
    }, 2000); // Simulate 2-second processing time

    res.json({
      message: 'Document processing started',
      document: {
        id: document._id,
        processingStatus: document.processingStatus
      }
    });

  } catch (error) {
    console.error('Process document error:', error);
    res.status(500).json({
      message: 'Failed to process document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/documents/stats/overview
// @desc    Get document statistics
// @access  Private
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalDocuments,
      syllabusCount,
      pyqCount,
      referenceCount,
      recentUploads
    ] = await Promise.all([
      Document.countDocuments({ uploadedBy: userId }),
      Document.countDocuments({ uploadedBy: userId, type: 'syllabus' }),
      Document.countDocuments({ uploadedBy: userId, type: 'pyq' }),
      Document.countDocuments({ uploadedBy: userId, type: 'reference' }),
      Document.find({ uploadedBy: userId })
        .select('title type createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.json({
      stats: {
        totalDocuments,
        syllabusCount,
        pyqCount,
        referenceCount,
        recentUploads
      }
    });

  } catch (error) {
    console.error('Get document stats error:', error);
    res.status(500).json({
      message: 'Failed to fetch document statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
