import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// IMPORTANT: Make sure to copy the exact values from your Firebase Console
// Firebase configuration for your project
const firebaseConfig = {
    apiKey: "AIzaSyDXwDHqrR70W7csSmiJWDM8mgHmN3Ju3Us",
    authDomain: "college-project-db237.firebaseapp.com",
    projectId: "college-project-db237",
    storageBucket: "college-project-db237.firebasestorage.app",
    messagingSenderId: "810063967170",
    appId: "1:810063967170:web:54da534f3a1ef8df255c5b",
    measurementId: "G-78D9GY87RT"
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