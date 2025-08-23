import React, { useState } from 'react';
import { Copy, CheckCircle, AlertCircle } from 'lucide-react';

const FirebaseConfigUpdater = () => {
  const [config, setConfig] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleConfigSubmit = () => {
    try {
      // Parse the Firebase config
      const configMatch = config.match(/const firebaseConfig = ({[\s\S]*?});/);
      if (!configMatch) {
        setMessage('Please paste the complete Firebase config code.');
        setMessageType('error');
        return;
      }

      // Safely parse the config object without using eval
      const configString = configMatch[1]
        .replace(/(\w+):/g, '"$1":') // Convert property names to quoted strings
        .replace(/'/g, '"'); // Replace single quotes with double quotes
      
      const configObject = JSON.parse(configString);
      
      // Generate the updated config file content
      const updatedConfig = `import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "${configObject.apiKey}",
    authDomain: "${configObject.authDomain}",
    projectId: "${configObject.projectId}",
    storageBucket: "${configObject.storageBucket}",
    messagingSenderId: "${configObject.messagingSenderId}",
    appId: "${configObject.appId}"${configObject.measurementId ? `,
    measurementId: "${configObject.measurementId}"` : ''}
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

export default app;`;

      navigator.clipboard.writeText(updatedConfig);
      setMessage('✅ Configuration copied to clipboard! Now paste it into src/firebase/config.js');
      setMessageType('success');
    } catch (error) {
      setMessage('❌ Error parsing config. Make sure you pasted the complete Firebase configuration.');
      setMessageType('error');
    }
  };

  const exampleConfig = `// Example of what to paste:
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Firebase Config Updater</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Create Your Firebase Project</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Console</a></li>
            <li>Click "Add project"</li>
            <li>Name it "EduGen-AI" (or your choice)</li>
            <li>Enable Authentication → Email/Password</li>
            <li>Create Firestore Database in test mode</li>
            <li>Add Web App and copy the config</li>
          </ol>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 2: Paste Your Firebase Config</h2>
          <p className="text-gray-600 mb-4">
            Paste the complete Firebase configuration code you got from Firebase Console:
          </p>
          
          <textarea
            value={config}
            onChange={(e) => setConfig(e.target.value)}
            placeholder={exampleConfig}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm"
          />
          
          <button
            onClick={handleConfigSubmit}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Copy className="h-4 w-4 mr-2" />
            Generate Updated Config
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg flex items-start space-x-3 ${
            messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            )}
            <p>{message}</p>
          </div>
        )}

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Step 3: Update Your Config File</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Copy the generated config (from the button above)</li>
            <li>Open <code className="bg-gray-200 px-2 py-1 rounded">src/firebase/config.js</code> in your editor</li>
            <li>Replace the entire file content with the copied code</li>
            <li>Save the file</li>
            <li>Try registering again!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FirebaseConfigUpdater;
