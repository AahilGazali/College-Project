const multer = require('multer');
const googleDriveService = require('../services/googleDriveService');

// Configure multer to store files in memory (we'll upload to cloud storage)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, and image files are allowed.'), false);
    }
  }
});

// Middleware to upload files to Google Drive
const uploadToCloudStorage = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      try {
        // Upload to Google Drive
        const driveResult = await googleDriveService.uploadFile(
          file.buffer,
          file.originalname,
          file.mimetype
        );

        // Add drive information to file object
        file.driveFileId = driveResult.fileId;
        file.driveLink = driveResult.driveLink;
        file.downloadLink = driveResult.downloadLink;

        uploadedFiles.push({
          originalName: file.originalname,
          fileName: driveResult.fileName,
          fileSize: file.size,
          mimeType: file.mimetype,
          driveFileId: driveResult.fileId,
          driveLink: driveResult.driveLink,
          downloadLink: driveResult.downloadLink
        });
      } catch (uploadError) {
        console.error(`Failed to upload ${file.originalname} to Google Drive:`, uploadError);
        // If Google Drive fails, fall back to local storage
        file.driveFileId = null;
        file.driveLink = null;
        file.downloadLink = null;
      }
    }

    req.uploadedFiles = uploadedFiles;
    next();
  } catch (error) {
    console.error('Cloud storage upload error:', error);
    next(error);
  }
};

// Middleware to handle multer errors
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files. Maximum 5 files allowed.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'Unexpected field name.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      message: error.message
    });
  }

  next(error);
};

module.exports = {
  upload,
  uploadToCloudStorage,
  handleMulterError
};
