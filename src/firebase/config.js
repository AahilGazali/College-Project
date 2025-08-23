import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// IMPORTANT: Make sure to copy the exact values from your Firebase Console
// Firebase configuration for your project
const firebaseConfig = {
    apiKey: "AIzaSyC6UkCXOdkp8fnOMBgvZHoubJseHD1Icng",
    authDomain: "question-paper-managemen-86623.firebaseapp.com",
    projectId: "question-paper-managemen-86623",
    storageBucket: "question-paper-managemen-86623.firebasestorage.app",
    messagingSenderId: "115043146879",
    appId: "1:115043146879:web:533d19b632d99b91ba334a",
    measurementId: "G-BMHGX8HQ2B"
};

// Initialize Firebase with error handling
let app;
try {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 