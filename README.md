# College Question Paper Generator

An AI-powered question paper generation system for college faculty, featuring Bloom's Taxonomy mapping, OCR document processing, and automated question generation.

## 🚀 Features

### Authentication & User Management
- **Login/Registration System** with role-based access (Admin + Faculty)
- **Firebase Authentication** for secure user management
- **Role-based permissions** and access control

### Document Processing
- **Upload Syllabus and PYQs** with drag-and-drop interface
- **PDF/Text/Image Support** for multiple document formats
- **Auto-extract text using OCR** (Tesseract.js) and PDF parsing
- **Intelligent topic extraction** from uploaded documents

### AI-Powered Question Generation
- **Bloom's Taxonomy Integration** with 6 cognitive levels:
  - Remembering
  - Understanding
  - Applying
  - Analyzing
  - Evaluating
  - Creating
- **Topic-based question generation** from syllabus units
- **Reference from PYQs** with similarity tagging
- **Customizable question parameters** (marks, difficulty, type)

### Question Paper Builder
- **Auto-generate full papers** with multiple sections
- **Manual editing capabilities** for fine-tuning
- **Section-wise organization** (Objective, Short Answer, Long Answer)
- **Export to PDF** for download and printing

## 🛠 Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **React Dropzone** - File upload handling
- **Lucide React** - Icon library

### Backend & Services
- **Firebase** - Backend as a Service
  - **Firebase Authentication** - User management
  - **Firestore** - NoSQL database
  - **Firebase Storage** - File storage
- **Node.js** - Runtime environment

### AI & Processing
- **Tesseract.js** - OCR for image processing
- **PDF.js** - PDF text extraction
- **OpenAI API** (planned) - AI question generation
- **Natural Language Processing** - Topic extraction

### Export & Generation
- **jsPDF** - PDF generation
- **HTML2Canvas** - Screenshot capture

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college-question-paper-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase config to `src/firebase/config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /documents/{documentId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       match /questionPapers/{paperId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

5. **Storage Security Rules**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /documents/{userId}/{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

6. **Start the development server**
   ```bash
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.js
│   │   └── Register.js
│   ├── dashboard/
│   │   └── Dashboard.js
│   ├── upload/
│   │   └── UploadDocuments.js
│   └── generate/
│       └── QuestionGenerator.js
├── contexts/
│   └── AuthContext.js
├── firebase/
│   └── config.js
├── App.js
├── index.js
└── index.css
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### AI Integration
To enable AI question generation, add your OpenAI API key:
```env
REACT_APP_OPENAI_API_KEY=your-openai-api-key
```

## 🚀 Usage

### For Faculty
1. **Register/Login** with faculty credentials
2. **Upload Documents** - Syllabus and previous year questions
3. **Generate Questions** - Select topics and Bloom's Taxonomy levels
4. **Review & Edit** - Customize generated questions
5. **Export Papers** - Download as PDF

### For Admins
1. **User Management** - Manage faculty accounts
2. **System Analytics** - View usage statistics
3. **Settings Configuration** - Configure system parameters

## 🔒 Security Features

- **Firebase Authentication** with email/password
- **Role-based access control** (Admin/Faculty)
- **Secure file uploads** with user-specific storage
- **Protected routes** and API endpoints
- **Input validation** and sanitization

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📦 Build for Production

```bash
# Create production build
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Advanced AI Integration** with GPT-4
- **Multi-language Support**
- **Advanced Analytics Dashboard**
- **Bulk Question Import/Export**
- **Collaborative Question Paper Creation**
- **Mobile App Development**
- **Integration with LMS Systems**

## 📊 Performance Optimization

- **Lazy loading** for components
- **Image optimization** for uploaded files
- **Caching strategies** for better performance
- **Code splitting** for faster initial load

---

**Built with ❤️ for educational institutions** 