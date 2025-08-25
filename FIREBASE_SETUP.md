# Firebase Setup Guide

## 🔥 IMPORTANT: Fix Firebase API Key Error

If you're getting the error "Firebase: Error (auth/api-key-not-valid)", follow these steps:

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enter a project name (e.g., "question-paper-generator")
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click "Email/Password" under "Sign-in method"
4. Enable "Email/Password" and click "Save"

### Step 3: Enable Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### Step 4: Enable Storage

1. Click "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Select a location and click "Done"

### Step 5: Get Configuration

1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Enter an app nickname (e.g., "Question Generator Web")
6. Click "Register app"
7. Copy the configuration object

### Step 6: Create Environment File

1. In your project root, create a file named `.env`
2. Add your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 7: Update Security Rules

#### Firestore Rules
Go to Firestore Database > Rules and update to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /documents/{documentId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage Rules
Go to Storage > Rules and update to:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 8: Restart Development Server

```bash
npm start
```

## ✅ Verification

After setup, you should see in the console:
```
Firebase initialized successfully
Project ID: your_project_id
Auth Domain: your_project_id.firebaseapp.com
```

## 🚨 Common Issues

1. **API Key Invalid**: Make sure you copied the entire API key (39 characters starting with "AIza")
2. **Project Not Found**: Verify your project ID is correct
3. **Authentication Not Enabled**: Make sure Email/Password is enabled in Authentication
4. **Rules Too Restrictive**: Check Firestore and Storage rules

## 🔒 Security Note

- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- Use different Firebase projects for development and production

## 📞 Need Help?

If you still encounter issues:
1. Check the browser console for detailed error messages
2. Verify all Firebase services are enabled
3. Ensure your configuration values are correct
4. Check if your Firebase project is active and not suspended
