import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';

const FirebaseReadyCheck = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkFirebase = () => {
      try {
        if (auth && db) {
          console.log('✅ Firebase is ready');
          setIsReady(true);
          setError(null);
        } else {
          throw new Error('Firebase services not initialized');
        }
      } catch (err) {
        console.error('Firebase readiness check failed:', err);
        setError(err.message);
        setIsReady(false);
      }
    };

    // Check immediately
    checkFirebase();
    
    // If not ready, retry after a delay
    if (!isReady) {
      const timer = setTimeout(() => {
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          checkFirebase();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isReady, retryCount]);

  if (isReady) {
    return children;
  }

  if (error && retryCount >= 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Firebase Initialization Failed
          </h1>
          
          <p className="text-lg text-gray-200 mb-6">
            The application failed to initialize Firebase after multiple attempts. 
            This prevents user registration and login.
          </p>
          
          <div className="card-gradient p-6 rounded-lg shadow-primary-lg border border-primary-200/20 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">What happened?</h2>
            <p className="text-gray-600 mb-3">
              Firebase services (Authentication and Database) could not be initialized properly.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Details:</h3>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800 text-left">
              {error}
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-secondary text-white px-6 py-3 rounded-lg hover:bg-gradient-accent transition-all duration-200 shadow-primary hover:shadow-primary-lg transform hover:-translate-y-1 mr-3"
            >
              Retry
            </button>
            
            <button
              onClick={() => window.location.href = '/test'}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200"
            >
              Test Firebase
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-300">
            <p>If this problem persists, please check your Firebase configuration.</p>
            <p>Retry attempts: {retryCount}/3</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-200 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Initializing Firebase...</h2>
        <p className="text-gray-200 mb-2">Please wait while we set up your application.</p>
        {retryCount > 0 && (
          <p className="text-sm text-primary-200">Retry attempt {retryCount}/3</p>
        )}
        {error && (
          <p className="text-sm text-orange-300 mt-2">Retrying...</p>
        )}
      </div>
    </div>
  );
};

export default FirebaseReadyCheck;
