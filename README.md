# College Question Paper Generator

A comprehensive web application for generating question papers using AI, built with React.js and MongoDB.

## 🚀 Features

### Core Functionality
- **AI-Powered Question Generation** using Bloom's Taxonomy
- **Document Upload & Processing** (PDF, DOC, DOCX, Images)
- **Question Paper Builder** with customizable sections
- **PDF Export** with professional formatting
- **Real-time Preview** of generated papers

### Authentication & User Management
- **Login/Registration System** with role-based access (Admin + Faculty)
- **JWT-based Authentication** for secure user management
- **Role-based permissions** and access control

### Document Management
- **Multi-format Support** - PDF, DOC, DOCX, TXT, Images
- **OCR Text Extraction** from images and scanned documents
- **Topic Analysis** and content categorization
- **Syllabus & PYQ Management** with organized storage

### Question Paper Features
- **Customizable Sections** (Part A, B, C)
- **Marks Distribution** with automatic calculation
- **Course Outcomes** mapping
- **Difficulty Level** classification
- **Module-wise** question organization

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **Axios** - HTTP client
- **PDF.js** - PDF processing
- **Tesseract.js** - OCR functionality
- **jsPDF** - PDF generation

### Backend & Services
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

## 🚀 Quick Start

### 1. Clone the Repository
   ```bash
   git clone <repository-url>
   cd college-question-paper-generator
   ```

### 2. Install Dependencies
   ```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### 3. Set Up MongoDB

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

### 4. Configure Environment Variables

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

### 5. Start the Application
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

## 📁 Project Structure

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
│   ├── components/            # React components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── generate/         # Question generation
│   │   ├── papers/           # Paper management
│   │   ├── upload/           # Document upload
│   │   └── settings/         # Settings components
│   ├── contexts/             # React contexts
│   │   ├── AuthContext.js    # Authentication context
│   │   └── DashboardContext.js
│   ├── services/             # API service layer
│   │   └── api.js
│   └── App.js
├── package.json
└── README.md
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
- `DELETE /api/documents/:id` - Delete document

### Question Papers
- `POST /api/papers` - Create question paper
- `GET /api/papers` - Get user's question papers
- `GET /api/papers/:id` - Get question paper by ID
- `PUT /api/papers/:id` - Update question paper
- `DELETE /api/papers/:id` - Delete question paper
- `POST /api/papers/:id/generate` - Generate questions

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## 🔒 Security Features

- **JWT Authentication** with secure token management
- **Password Hashing** using bcrypt with salt rounds
- **Input Validation** with express-validator
- **Rate Limiting** to prevent API abuse
- **CORS Protection** with configurable policies
- **File Upload Security** with type validation and size limits
- **Role-based Access Control** (Admin and Faculty roles)

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

## 🎯 Key Features

1. **AI Question Generation**: Uses Bloom's Taxonomy for intelligent question creation
2. **Document Processing**: Automatic text extraction from various file formats
3. **Real-time Preview**: Live preview of generated question papers
4. **PDF Export**: Professional PDF generation with custom formatting
5. **User Management**: Role-based access with admin and faculty roles
6. **File Management**: Secure file upload and storage system
7. **Responsive Design**: Mobile-friendly interface

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

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in server/.env
   - Check network access (for Atlas)

2. **JWT Token Errors**
   - Verify JWT_SECRET is set in server/.env
   - Check token expiration
   - Clear localStorage and login again

3. **File Upload Issues**
   - Check file size limits
   - Verify file types
   - Ensure upload directory exists

4. **CORS Errors**
   - Update FRONTEND_URL in server/.env
   - Check CORS configuration

## 📝 Scripts

- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run server` - Start backend server
- `npm run server:dev` - Start backend in development mode
- `npm run dev` - Start both frontend and backend
- `npm run install:all` - Install all dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the server logs for backend issues
- Check browser console for frontend issues
- Verify MongoDB connection
- Test API endpoints with Postman
- Review the server/README.md for detailed setup

## 🎉 Migration Complete!

This project has been successfully migrated from Firebase to MongoDB! Check the `MONGODB_MIGRATION_GUIDE.md` for detailed migration information and benefits.