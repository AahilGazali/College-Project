import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration with environment variables support
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDXwDHqrR70W7csSmiJWDM8mgHmN3Ju3Us",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "college-project-db237.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "college-project-db237",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "college-project-db237.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "810063967170",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:810063967170:web:54da534f3a1ef8df255c5b",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-78D9GY87RT"
};

// Validate Firebase configuration
const validateFirebaseConfig = (config) => {
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingFields = requiredFields.filter(field => !config[field] || config[field] === '');
    
    if (missingFields.length > 0) {
        throw new Error(`Missing Firebase configuration fields: ${missingFields.join(', ')}`);
    }
    
    // Check if API key looks valid (should be 39 characters and start with AIza)
    if (!config.apiKey.startsWith('AIza') || config.apiKey.length !== 39) {
        throw new Error('Invalid Firebase API key format. Please check your configuration.');
    }
    
    return true;
};

// Initialize Firebase with comprehensive error handling
let app;
try {
    // Validate configuration before initializing
    validateFirebaseConfig(firebaseConfig);
    
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    console.log('Project ID:', firebaseConfig.projectId);
    console.log('Auth Domain:', firebaseConfig.authDomain);
} catch (error) {
    console.error('Firebase initialization error:', error);
    
    // Provide helpful error message for developers
    if (error.message.includes('API key')) {
        console.error(`
🔥 FIREBASE CONFIGURATION ERROR 🔥
The Firebase API key is invalid or missing. Please:

1. Go to https://console.firebase.google.com/
2. Select your project (or create a new one)
3. Go to Project Settings > General
4. Copy the configuration values
5. Create a .env file in your project root with:
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

6. Restart your development server
        `);
    }
    
    throw error;
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;