const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
const documentsDir = path.join(uploadDir, 'documents');
const avatarsDir = path.join(uploadDir, 'avatars');

[uploadDir, documentsDir, avatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// File filter for documents
const documentFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, and image files are allowed.'), false);
  }
};

// File filter for avatars
const avatarFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG images are allowed for avatars.'), false);
  }
};

// Storage configuration for documents
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user._id;
    const userDir = path.join(documentsDir, userId.toString());
    
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  }
});

// Storage configuration for avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user._id;
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${userId}-${Date.now()}${ext}`);
  }
});

// Multer configurations
const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 5 // Maximum 5 files per request
  }
});

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB for avatars
    files: 1 // Only one avatar per request
  }
});

// Middleware to process uploaded images
const processImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filePath = req.file.path;
    const processedPath = filePath.replace(path.extname(filePath), '_processed' + path.extname(filePath));

    // Process image with sharp
    await sharp(filePath)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(processedPath);

    // Replace original with processed version
    fs.unlinkSync(filePath);
    req.file.path = processedPath;
    req.file.filename = path.basename(processedPath);

    next();
  } catch (error) {
    console.error('Image processing error:', error);
    next(error);
  }
};

// Middleware to extract text from uploaded files
const extractTextFromFile = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    let extractedText = '';

    if (mimeType === 'application/pdf') {
      const pdfParse = require('pdf-parse');
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } else if (mimeType.startsWith('text/')) {
      extractedText = fs.readFileSync(filePath, 'utf8');
    } else if (mimeType.startsWith('image/')) {
      // For images, we would use OCR here
      // For now, we'll leave it empty and handle it in the document processing
      extractedText = '';
    }

    req.file.extractedText = extractedText;
    next();
  } catch (error) {
    console.error('Text extraction error:', error);
    // Don't fail the request if text extraction fails
    req.file.extractedText = '';
    next();
  }
};

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum file size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files. Maximum 5 files per request.'
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
  uploadDocument,
  uploadAvatar,
  processImage,
  extractTextFromFile,
  handleMulterError
};
