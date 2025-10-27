# Backend Setup Guide

## 🚀 MongoDB Backend Setup

This guide will help you set up the MongoDB backend for the College Question Paper Generator.

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Navigate to the server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/question-paper-generator

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

### MongoDB Setup

#### Option 1: Local MongoDB

1. **Install MongoDB**
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB service**
   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```

#### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account

2. **Create a cluster**
   - Choose the free tier (M0)
   - Select a region close to you
   - Create cluster

3. **Set up database access**
   - Go to "Database Access"
   - Add a new database user
   - Set username and password

4. **Whitelist IP addresses**
   - Go to "Network Access"
   - Add your IP address or use `0.0.0.0/0` for development

5. **Get connection string**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Update `MONGODB_URI` in your `.env` file

### Running the Server

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

The server will be running on `http://localhost:5000`

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/change-password` - Change password

#### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)

#### Documents
- `POST /api/documents/upload` - Upload documents
- `GET /api/documents` - Get user's documents
- `GET /api/documents/:id` - Get document by ID
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/download` - Download document

#### Question Papers
- `POST /api/papers` - Create question paper
- `GET /api/papers` - Get user's question papers
- `GET /api/papers/:id` - Get question paper by ID
- `PUT /api/papers/:id` - Update question paper
- `DELETE /api/papers/:id` - Delete question paper
- `POST /api/papers/:id/generate` - Generate questions using AI

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/faculty),
  isActive: Boolean,
  avatar: String,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Documents Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  type: String (syllabus/pyq/reference),
  subject: String,
  subjectCode: String,
  fileName: String,
  originalName: String,
  filePath: String,
  fileSize: Number,
  mimeType: String,
  uploadedBy: ObjectId (ref: User),
  extractedText: String,
  topics: Array,
  processingStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Question Papers Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  subject: String,
  subjectCode: String,
  totalMarks: Number,
  examDuration: Number,
  sections: Array,
  courseOutcomes: Array,
  modules: Array,
  status: String (draft/review/approved),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### File Upload

The server handles file uploads with the following features:

- **Supported formats**: PDF, DOC, DOCX, TXT, Images (JPEG, PNG)
- **File size limit**: 10MB (configurable)
- **Storage**: Local filesystem (can be configured for cloud storage)
- **Processing**: Automatic text extraction from PDFs and images
- **Security**: User-specific file storage

### Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: express-validator for request validation
- **Rate Limiting**: Prevents abuse with request limits
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **File Upload Security**: File type validation and size limits

### Development vs Production

#### Development
- Detailed error messages
- Console logging
- Hot reloading with nodemon
- Test database

#### Production
- Minimal error messages
- Logging to files
- Process management with PM2
- Production database

### Troubleshooting

#### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string
   - Check network access (for Atlas)

2. **JWT Token Errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper token format

3. **File Upload Issues**
   - Check file size limits
   - Verify file types
   - Ensure upload directory exists

4. **CORS Errors**
   - Update FRONTEND_URL in .env
   - Check CORS configuration

### Testing

Run tests with:
```bash
npm test
```

### Deployment

For production deployment:

1. **Set production environment variables**
2. **Use PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "question-paper-api"
   ```
3. **Set up reverse proxy (nginx)**
4. **Configure SSL certificates**
5. **Set up monitoring and logging**

### Support

For issues and questions:
- Check the console logs
- Verify environment variables
- Test API endpoints with Postman/curl
- Check MongoDB connection
