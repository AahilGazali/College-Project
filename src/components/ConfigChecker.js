import React from 'react';

const ConfigChecker = () => {
  // Get Firebase config from environment or fallback
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyC6UkCXOdkp8fnOMBgvZHoubJseHD1Icng",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "question-paper-managemen-86623.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "question-paper-managemen-86623",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "question-paper-managemen-86623.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "115043146879",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:115043146879:web:533d19b632d99b91ba334a",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-BMHGX8HQ2B"
  };

  const checkConfig = () => {
    const issues = [];
    
    // Check if API key looks valid
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.length < 30) {
      issues.push("API Key appears to be invalid or too short");
    }
    
    // Check if project ID is present
    if (!firebaseConfig.projectId) {
      issues.push("Project ID is missing");
    }
    
    // Check if auth domain is correct format
    if (!firebaseConfig.authDomain || !firebaseConfig.authDomain.includes('.firebaseapp.com')) {
      issues.push("Auth Domain format appears incorrect");
    }
    
    // Check if app ID is present
    if (!firebaseConfig.appId) {
      issues.push("App ID is missing");
    }
    
    return issues;
  };

  const issues = checkConfig();

  return (
    <div className="p-6 max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Firebase Configuration Checker</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Current Configuration:</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>API Key:</strong>
              <div className="font-mono text-xs break-all mt-1">
                {firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 20)}...` : 'Not set'}
              </div>
            </div>
            <div>
              <strong>Project ID:</strong>
              <div className="font-mono text-xs mt-1">{firebaseConfig.projectId || 'Not set'}</div>
            </div>
            <div>
              <strong>Auth Domain:</strong>
              <div className="font-mono text-xs mt-1">{firebaseConfig.authDomain || 'Not set'}</div>
            </div>
            <div>
              <strong>Storage Bucket:</strong>
              <div className="font-mono text-xs mt-1">{firebaseConfig.storageBucket || 'Not set'}</div>
            </div>
            <div>
              <strong>Messaging Sender ID:</strong>
              <div className="font-mono text-xs mt-1">{firebaseConfig.messagingSenderId || 'Not set'}</div>
            </div>
            <div>
              <strong>App ID:</strong>
              <div className="font-mono text-xs mt-1">{firebaseConfig.appId || 'Not set'}</div>
            </div>
          </div>
        </div>
      </div>

      {issues.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-red-600">⚠️ Configuration Issues Found:</h3>
          <ul className="list-disc list-inside space-y-2 text-red-600">
            {issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-green-600">✅ Configuration Looks Good</h3>
          <p className="text-gray-600">All required Firebase configuration values are present.</p>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Next Steps:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Console</a></li>
          <li>Select your project: <strong>question-paper-management</strong></li>
          <li>Go to <strong>Authentication</strong> → <strong>Sign-in method</strong></li>
          <li>Enable <strong>Email/Password</strong> authentication</li>
          <li>Go to <strong>Firestore Database</strong> and create a database in test mode</li>
          <li>Test the connection using the debugger above</li>
        </ol>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Common Issues:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li><strong>API Key Invalid:</strong> Make sure you copied the exact API key from Firebase Console</li>
          <li><strong>Authentication Not Enabled:</strong> Enable Email/Password in Firebase Console</li>
          <li><strong>Firestore Not Created:</strong> Create a Firestore database in test mode</li>
          <li><strong>Project Region:</strong> Some regions may have restrictions</li>
          <li><strong>Network Issues:</strong> Check if your network allows Firebase connections</li>
        </ul>
      </div>
    </div>
  );
};

export default ConfigChecker;
