const express = require('express');
const { body, validationResult, query } = require('express-validator');
const QuestionPaper = require('../models/QuestionPaper');
const Question = require('../models/Question');
const Document = require('../models/Document');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/papers
// @desc    Create a new question paper
// @access  Private
router.post('/', [
  authenticateToken,
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('subject').trim().isLength({ min: 1 }).withMessage('Subject is required'),
  body('subjectCode').trim().isLength({ min: 1 }).withMessage('Subject code is required'),
  body('totalMarks').isInt({ min: 1 }).withMessage('Total marks must be a positive integer'),
  body('examDuration').isInt({ min: 1 }).withMessage('Exam duration must be a positive integer'),
  body('courseOutcomes').isArray({ min: 1 }).withMessage('At least one course outcome is required'),
  body('modules').isArray({ min: 1 }).withMessage('At least one module is required'),
  body('sections').isArray({ min: 1 }).withMessage('At least one section is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      subject,
      subjectCode,
      totalMarks,
      examDuration,
      instructions,
      courseOutcomes,
      modules,
      sections,
      difficultyDistribution,
      bloomDistribution,
      tags
    } = req.body;

    // Validate sections
    let totalCalculatedMarks = 0;
    for (const section of sections) {
      if (!section.name || !section.marksPerQuestion || !section.totalQuestions || !section.questionsToAnswer) {
        return res.status(400).json({
          message: 'All sections must have name, marksPerQuestion, totalQuestions, and questionsToAnswer'
        });
      }
      totalCalculatedMarks += section.marksPerQuestion * section.questionsToAnswer;
    }

    if (totalCalculatedMarks !== totalMarks) {
      return res.status(400).json({
        message: `Total calculated marks (${totalCalculatedMarks}) does not match specified total marks (${totalMarks})`
      });
    }

    const questionPaper = new QuestionPaper({
      title,
      description: description || '',
      subject,
      subjectCode,
      totalMarks,
      examDuration,
      instructions: instructions || '',
      courseOutcomes,
      modules,
      sections: sections.map((section, index) => ({
        ...section,
        questions: [],
        order: index
      })),
      difficultyDistribution: difficultyDistribution || {},
      bloomDistribution: bloomDistribution || {},
      createdBy: req.user._id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await questionPaper.save();

    res.status(201).json({
      message: 'Question paper created successfully',
      questionPaper
    });

  } catch (error) {
    console.error('Create question paper error:', error);
    res.status(500).json({
      message: 'Failed to create question paper',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/papers
// @desc    Get user's question papers
// @access  Private
router.get('/', [
  authenticateToken,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['draft', 'review', 'approved', 'published', 'archived']).withMessage('Invalid status'),
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
    const { status, subject, search } = req.query;

    // Build filter object
    const filter = { createdBy: req.user._id };
    if (status) filter.status = status;
    if (subject) filter.subject = new RegExp(subject, 'i');
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    // Get question papers with pagination
    const questionPapers = await QuestionPaper.find(filter)
      .populate('createdBy', 'name email')
      .populate('reviewedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await QuestionPaper.countDocuments(filter);

    res.json({
      questionPapers,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });

  } catch (error) {
    console.error('Get question papers error:', error);
    res.status(500).json({
      message: 'Failed to fetch question papers',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/papers/:id
// @desc    Get question paper by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const questionPaper = await QuestionPaper.findById(id)
      .populate('createdBy', 'name email')
      .populate('reviewedBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('sections.questions', 'question type marks difficulty bloomLevel');

    if (!questionPaper) {
      return res.status(404).json({
        message: 'Question paper not found'
      });
    }

    // Check if user has access to this question paper
    if (req.user.role !== 'admin' && questionPaper.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only view your own question papers.'
      });
    }

    res.json({ questionPaper });

  } catch (error) {
    console.error('Get question paper error:', error);
    res.status(500).json({
      message: 'Failed to fetch question paper',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/papers/:id
// @desc    Update question paper
// @access  Private
router.put('/:id', [
  authenticateToken,
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('instructions').optional().trim().isLength({ max: 2000 }).withMessage('Instructions must be less than 2000 characters'),
  body('status').optional().isIn(['draft', 'review', 'approved', 'published', 'archived']).withMessage('Invalid status')
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
    const { title, description, instructions, status, tags } = req.body;

    const questionPaper = await QuestionPaper.findById(id);

    if (!questionPaper) {
      return res.status(404).json({
        message: 'Question paper not found'
      });
    }

    // Check if user has access to this question paper
    if (req.user.role !== 'admin' && questionPaper.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only update your own question papers.'
      });
    }

    // Update question paper
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (instructions !== undefined) updateData.instructions = instructions;
    if (status) updateData.status = status;
    if (tags) updateData.tags = tags.split(',').map(tag => tag.trim());

    const updatedQuestionPaper = await QuestionPaper.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      message: 'Question paper updated successfully',
      questionPaper: updatedQuestionPaper
    });

  } catch (error) {
    console.error('Update question paper error:', error);
    res.status(500).json({
      message: 'Failed to update question paper',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/papers/:id
// @desc    Delete question paper
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const questionPaper = await QuestionPaper.findById(id);

    if (!questionPaper) {
      return res.status(404).json({
        message: 'Question paper not found'
      });
    }

    // Check if user has access to this question paper
    if (req.user.role !== 'admin' && questionPaper.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only delete your own question papers.'
      });
    }

    await QuestionPaper.findByIdAndDelete(id);

    res.json({
      message: 'Question paper deleted successfully'
    });

  } catch (error) {
    console.error('Delete question paper error:', error);
    res.status(500).json({
      message: 'Failed to delete question paper',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/papers/:id/questions
// @desc    Add questions to a section
// @access  Private
router.post('/:id/questions', [
  authenticateToken,
  body('sectionIndex').isInt({ min: 0 }).withMessage('Section index must be a non-negative integer'),
  body('questionIds').isArray({ min: 1 }).withMessage('At least one question ID is required')
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
    const { sectionIndex, questionIds } = req.body;

    const questionPaper = await QuestionPaper.findById(id);

    if (!questionPaper) {
      return res.status(404).json({
        message: 'Question paper not found'
      });
    }

    // Check if user has access to this question paper
    if (req.user.role !== 'admin' && questionPaper.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only modify your own question papers.'
      });
    }

    // Validate section index
    if (sectionIndex >= questionPaper.sections.length) {
      return res.status(400).json({
        message: 'Invalid section index'
      });
    }

    // Verify questions exist and belong to user
    const questions = await Question.find({
      _id: { $in: questionIds },
      createdBy: req.user._id
    });

    if (questions.length !== questionIds.length) {
      return res.status(400).json({
        message: 'Some questions not found or you do not have access to them'
      });
    }

    // Add questions to section
    const section = questionPaper.sections[sectionIndex];
    section.questions = [...new Set([...section.questions, ...questionIds])]; // Remove duplicates

    await questionPaper.save();

    res.json({
      message: 'Questions added to section successfully',
      questionPaper
    });

  } catch (error) {
    console.error('Add questions error:', error);
    res.status(500).json({
      message: 'Failed to add questions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/papers/:id/questions/:questionId
// @desc    Remove question from section
// @access  Private
router.delete('/:id/questions/:questionId', [
  authenticateToken,
  body('sectionIndex').isInt({ min: 0 }).withMessage('Section index must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id, questionId } = req.params;
    const { sectionIndex } = req.body;

    const questionPaper = await QuestionPaper.findById(id);

    if (!questionPaper) {
      return res.status(404).json({
        message: 'Question paper not found'
      });
    }

    // Check if user has access to this question paper
    if (req.user.role !== 'admin' && questionPaper.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only modify your own question papers.'
      });
    }

    // Validate section index
    if (sectionIndex >= questionPaper.sections.length) {
      return res.status(400).json({
        message: 'Invalid section index'
      });
    }

    // Remove question from section
    const section = questionPaper.sections[sectionIndex];
    section.questions = section.questions.filter(q => q.toString() !== questionId);

    await questionPaper.save();

    res.json({
      message: 'Question removed from section successfully',
      questionPaper
    });

  } catch (error) {
    console.error('Remove question error:', error);
    res.status(500).json({
      message: 'Failed to remove question',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/papers/:id/generate
// @desc    Generate questions for paper using AI
// @access  Private
router.post('/:id/generate', [
  authenticateToken,
  body('sectionIndex').isInt({ min: 0 }).withMessage('Section index must be a non-negative integer'),
  body('count').isInt({ min: 1, max: 50 }).withMessage('Count must be between 1 and 50'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('bloomLevel').optional().isIn(['remembering', 'understanding', 'applying', 'analyzing', 'evaluating', 'creating']).withMessage('Invalid Bloom level')
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
    const { sectionIndex, count, difficulty, bloomLevel, module, courseOutcome } = req.body;

    const questionPaper = await QuestionPaper.findById(id);

    if (!questionPaper) {
      return res.status(404).json({
        message: 'Question paper not found'
      });
    }

    // Check if user has access to this question paper
    if (req.user.role !== 'admin' && questionPaper.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only modify your own question papers.'
      });
    }

    // Validate section index
    if (sectionIndex >= questionPaper.sections.length) {
      return res.status(400).json({
        message: 'Invalid section index'
      });
    }

    // Simulate AI question generation
    const generatedQuestions = [];
    for (let i = 0; i < count; i++) {
      const question = new Question({
        question: `Generated question ${i + 1} for ${questionPaper.subject} - ${module || 'General'}`,
        type: 'short-answer',
        marks: questionPaper.sections[sectionIndex].marksPerQuestion,
        difficulty: difficulty || 'medium',
        bloomLevel: bloomLevel || 'understanding',
        subject: questionPaper.subject,
        subjectCode: questionPaper.subjectCode,
        module: module || questionPaper.modules[0],
        courseOutcome: courseOutcome || questionPaper.courseOutcomes[0],
        correctAnswer: 'Sample answer',
        explanation: 'This is a generated question',
        keywords: ['generated', 'ai', 'sample'],
        createdBy: req.user._id,
        isTemplate: true
      });

      await question.save();
      generatedQuestions.push(question);
    }

    // Add generated questions to section
    const section = questionPaper.sections[sectionIndex];
    const questionIds = generatedQuestions.map(q => q._id);
    section.questions = [...new Set([...section.questions, ...questionIds])];

    await questionPaper.save();

    res.json({
      message: 'Questions generated successfully',
      questions: generatedQuestions,
      questionPaper
    });

  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({
      message: 'Failed to generate questions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/papers/:id/review
// @desc    Add review comment
// @access  Private
router.post('/:id/review', [
  authenticateToken,
  body('comment').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment is required and must be less than 1000 characters')
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
    const { comment } = req.body;

    const questionPaper = await QuestionPaper.findById(id);

    if (!questionPaper) {
      return res.status(404).json({
        message: 'Question paper not found'
      });
    }

    // Add review comment
    await questionPaper.addReviewComment(req.user._id, comment);

    res.json({
      message: 'Review comment added successfully',
      questionPaper
    });

  } catch (error) {
    console.error('Add review comment error:', error);
    res.status(500).json({
      message: 'Failed to add review comment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/papers/:id/status
// @desc    Update question paper status
// @access  Private
router.post('/:id/status', [
  authenticateToken,
  body('status').isIn(['draft', 'review', 'approved', 'published', 'archived']).withMessage('Invalid status')
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
    const { status } = req.body;

    const questionPaper = await QuestionPaper.findById(id);

    if (!questionPaper) {
      return res.status(404).json({
        message: 'Question paper not found'
      });
    }

    // Check permissions based on status change
    if (status === 'approved' && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Only admins can approve question papers'
      });
    }

    // Update status
    await questionPaper.updateStatus(status, req.user._id);

    res.json({
      message: 'Question paper status updated successfully',
      questionPaper
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      message: 'Failed to update status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/papers/stats/overview
// @desc    Get question paper statistics
// @access  Private
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalPapers,
      draftPapers,
      reviewPapers,
      approvedPapers,
      recentPapers
    ] = await Promise.all([
      QuestionPaper.countDocuments({ createdBy: userId }),
      QuestionPaper.countDocuments({ createdBy: userId, status: 'draft' }),
      QuestionPaper.countDocuments({ createdBy: userId, status: 'review' }),
      QuestionPaper.countDocuments({ createdBy: userId, status: 'approved' }),
      QuestionPaper.find({ createdBy: userId })
        .select('title status createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.json({
      stats: {
        totalPapers,
        draftPapers,
        reviewPapers,
        approvedPapers,
        recentPapers
      }
    });

  } catch (error) {
    console.error('Get question paper stats error:', error);
    res.status(500).json({
      message: 'Failed to fetch question paper statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
