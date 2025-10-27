const express = require('express');
const { uploadAvatar, processImage, handleMulterError } = require('../middleware/upload');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/upload/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', [
  authenticateToken,
  uploadAvatar.single('avatar'),
  processImage,
  handleMulterError
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    // Update user avatar
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.file.filename },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: req.file.filename,
      user
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      message: 'Failed to upload avatar',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
