# College Question Paper Generator - MongoDB Migration Complete

## 🎉 Migration Summary

Your Firebase-based College Question Paper Generator has been successfully migrated to MongoDB! Here's what has been changed:

### ✅ What's Been Migrated

1. **Backend Infrastructure**
   - ✅ Firebase Authentication → JWT-based authentication
   - ✅ Firestore Database → MongoDB with Mongoose
   - ✅ Firebase Storage → Local file storage with multer
   - ✅ Firebase Functions → Express.js API endpoints

2. **Frontend Updates**
   - ✅ Firebase Auth Context → JWT token management
   - ✅ Firebase Firestore hooks → REST API calls
   - ✅ Firebase Storage → File upload API
   - ✅ Firebase imports removed

3. **New Features Added**
   - ✅ Comprehensive API service layer
   - ✅ File upload with progress tracking
   - ✅ Document processing and text extraction
   - ✅ Question paper generation API
   - ✅ User management system
   - ✅ Role-based access control

## 🚀 Quick Start Guide

### 1. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### 2. Set Up MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Windows: Download from MongoDB website
# macOS: brew install mongodb-community
# Linux: Follow MongoDB installation guide

# Start MongoDB service
# Windows: net start MongoDB
# macOS/Linux: sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a cluster (M0 free tier)
4. Get your connection string
5. Update the connection string in server/.env

### 3. Configure Environment Variables

Create `server/.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/question-paper-generator
# OR for Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/question-paper-generator

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 4. Start the Application

```bash
# Start both frontend and backend
npm run dev

# OR start them separately:
# Backend: npm run server:dev
# Frontend: npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 New Project Structure

```
college-question-paper-generator/
├── server/                     # Backend API
│   ├── models/                 # MongoDB models
│   │   ├── User.js
│   │   ├── Document.js
│   │   ├── Question.js
│   │   └── QuestionPaper.js
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── documents.js
│   │   ├── papers.js
│   │   └── upload.js
│   ├── middleware/             # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── server.js              # Main server file
│   ├── package.json
│   └── README.md
├── src/
│   ├── services/              # API service layer
│   │   └── api.js
│   ├── contexts/             # Updated contexts
│   │   ├── AuthContext.js    # Now uses JWT
│   │   └── DashboardContext.js
│   └── components/           # Frontend components (unchanged)
└── package.json              # Updated dependencies
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Documents
- `POST /api/documents/upload` - Upload documents
- `GET /api/documents` - Get user's documents
- `GET /api/documents/:id/download` - Download document

### Question Papers
- `POST /api/papers` - Create question paper
- `GET /api/papers` - Get user's question papers
- `POST /api/papers/:id/generate` - Generate questions

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: express-validator for all inputs
- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Configurable cross-origin policies
- **File Upload Security**: Type validation and size limits
- **Role-based Access**: Admin and Faculty roles

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/faculty),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Documents Collection
```javascript
{
  _id: ObjectId,
  title: String,
  type: String (syllabus/pyq/reference),
  subject: String,
  fileName: String,
  filePath: String,
  uploadedBy: ObjectId (ref: User),
  extractedText: String,
  topics: Array,
  createdAt: Date
}
```

### Question Papers Collection
```javascript
{
  _id: ObjectId,
  title: String,
  subject: String,
  totalMarks: Number,
  examDuration: Number,
  sections: Array,
  courseOutcomes: Array,
  modules: Array,
  status: String (draft/review/approved),
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

## 🎯 Key Improvements

1. **Better Performance**: Direct MongoDB queries instead of Firebase SDK
2. **More Control**: Full control over database schema and queries
3. **Cost Effective**: No Firebase usage limits or costs
4. **Scalability**: Easy to scale with MongoDB Atlas
5. **Flexibility**: Easy to add new features and endpoints
6. **Security**: Enhanced security with JWT and input validation

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Check if MongoDB is running
   # Verify connection string in .env
   # Check network access (for Atlas)
   ```

2. **JWT Token Errors**
   ```bash
   # Verify JWT_SECRET is set in .env
   # Check token expiration
   # Clear localStorage and login again
   ```

3. **File Upload Issues**
   ```bash
   # Check file size limits
   # Verify file types
   # Ensure upload directory exists
   ```

4. **CORS Errors**
   ```bash
   # Update FRONTEND_URL in server/.env
   # Check CORS configuration
   ```

## 🚀 Deployment

### Development
```bash
npm run dev  # Starts both frontend and backend
```

### Production
```bash
# Build frontend
npm run build

# Start backend
npm run server

# Or use PM2 for process management
npm install -g pm2
pm2 start server/server.js --name "question-paper-api"
```

## 📝 Migration Checklist

- ✅ Backend server created with Express.js
- ✅ MongoDB models and schemas defined
- ✅ JWT authentication implemented
- ✅ File upload system with multer
- ✅ API endpoints for all features
- ✅ Frontend API service layer
- ✅ AuthContext updated for JWT
- ✅ DashboardContext updated for API calls
- ✅ Firebase dependencies removed
- ✅ Environment configuration setup
- ✅ Documentation created

## 🎉 You're All Set!

Your College Question Paper Generator is now running on MongoDB! The migration is complete and all features should work as before, but with better performance and more control.

### Next Steps

1. **Test the application**: Register a new user and test all features
2. **Customize**: Modify the API endpoints or add new features
3. **Deploy**: Follow the deployment guide for production
4. **Monitor**: Set up logging and monitoring for production use

### Need Help?

- Check the server logs for backend issues
- Check browser console for frontend issues
- Verify MongoDB connection
- Test API endpoints with Postman
- Review the server/README.md for detailed setup

Happy coding! 🚀
