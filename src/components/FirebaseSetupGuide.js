import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

const FirebaseSetupGuide = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testFirebaseSetup = async () => {
    setLoading(true);
    try {
      // Test with a random email to avoid conflicts
      const testEmail = `test${Date.now()}@example.com`;
      const testPassword = 'testpass123';
      
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      
      // If successful, clean up the test user
      await userCredential.user.delete();
      
      setTestResult({
        success: true,
        message: 'Firebase is configured correctly! ✅'
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error.code,
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const setupSteps = [
    {
      title: 'Step 1: Go to Firebase Console',
      description: 'Open Firebase Console and select your project',
      action: (
        <a 
          href="https://console.firebase.google.com/project/question-paper-managemen-86623" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Open Firebase Console <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      )
    },
    {
      title: 'Step 2: Enable Authentication',
      description: 'Go to Authentication → Sign-in method → Enable Email/Password',
      action: (
        <a 
          href="https://console.firebase.google.com/project/question-paper-managemen-86623/authentication/providers" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Enable Authentication <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      )
    },
    {
      title: 'Step 3: Create Firestore Database',
      description: 'Go to Firestore Database → Create database → Start in test mode',
      action: (
        <a 
          href="https://console.firebase.google.com/project/question-paper-managemen-86623/firestore" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Create Firestore <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      )
    },
    {
      title: 'Step 4: Add Web App (if needed)',
      description: 'Go to Project Settings → Your apps → Add app → Web',
      action: (
        <a 
          href="https://console.firebase.google.com/project/question-paper-managemen-86623/settings/general" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Project Settings <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Firebase Setup Guide</h1>
        
        {/* Test Button */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Your Firebase Setup</h2>
          <button
            onClick={testFirebaseSetup}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Firebase Connection'}
          </button>
          
          {testResult && (
            <div className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
              testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">{testResult.message}</p>
                {!testResult.success && (
                  <p className="text-sm mt-1">Error Code: {testResult.error}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Setup Steps */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Setup Steps</h2>
          
          {setupSteps.map((step, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                </div>
              </div>
              <div className="mt-4">
                {step.action}
              </div>
            </div>
          ))}
        </div>

        {/* Common Issues */}
        <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Common Issues & Solutions
          </h3>
          <ul className="space-y-2 text-yellow-700">
            <li><strong>API Key Not Valid:</strong> Make sure you've created a web app in Firebase Console</li>
            <li><strong>Authentication Disabled:</strong> Enable Email/Password authentication</li>
            <li><strong>Missing Firestore:</strong> Create a Firestore database in test mode</li>
            <li><strong>Wrong Project:</strong> Ensure you're in the correct Firebase project</li>
          </ul>
        </div>

        {/* Current Configuration */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Project ID:</strong> question-paper-managemen-86623
            </div>
            <div>
              <strong>Auth Domain:</strong> question-paper-managemen-86623.firebaseapp.com
            </div>
            <div>
              <strong>Storage Bucket:</strong> question-paper-managemen-86623.firebasestorage.app
            </div>
            <div>
              <strong>App ID:</strong> 1:115043146879:web:533d19b632d99b91ba334a
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetupGuide;
