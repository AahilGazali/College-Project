import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const FirebaseTest = () => {
  const [status, setStatus] = useState('Ready to test Firebase connection...');
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, result, error = null) => {
    setTestResults(prev => [...prev, { test, result, error, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testFirebaseConnection = async () => {
    setTestResults([]);
    setError(null);
    
    try {
      // Test 1: Basic Firebase initialization
      setStatus('Testing Firebase initialization...');
      addTestResult('Firebase Init', 'Checking if Firebase is properly initialized...');
      
      if (auth && db) {
        addTestResult('Firebase Init', '✅ Firebase services initialized successfully');
      } else {
        addTestResult('Firebase Init', '❌ Firebase services not initialized');
        return;
      }

      // Test 2: Anonymous authentication
      setStatus('Testing anonymous authentication...');
      addTestResult('Anonymous Auth', 'Attempting anonymous sign-in...');
      
      const result = await signInAnonymously(auth);
      addTestResult('Anonymous Auth', `✅ Success! User ID: ${result.user.uid}`);
      
      // Sign out immediately
      await auth.signOut();
      addTestResult('Anonymous Auth', '✅ Signed out successfully');

      // Test 3: Firestore connection
      setStatus('Testing Firestore connection...');
      addTestResult('Firestore', 'Testing Firestore write operation...');
      
      const testDoc = doc(db, 'test', 'connection-test');
      await setDoc(testDoc, { 
        test: true, 
        timestamp: new Date().toISOString(),
        message: 'Firestore connection test'
      });
      addTestResult('Firestore', '✅ Write operation successful');
      
      // Test read operation
      const readResult = await getDoc(testDoc);
      if (readResult.exists()) {
        addTestResult('Firestore', '✅ Read operation successful');
      } else {
        addTestResult('Firestore', '❌ Read operation failed');
      }

      setStatus('All tests completed successfully!');
      
    } catch (err) {
      setError(`Firebase test failed: ${err.message}`);
      setStatus('Connection failed');
      addTestResult('Error', '❌', err.message);
      console.error('Firebase test error:', err);
    }
  };

  const testEmailAuth = async () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    try {
      setStatus('Testing email/password authentication...');
      addTestResult('Email Auth', `Creating test user: ${testEmail}`);
      
      // Test registration
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      addTestResult('Email Auth', `✅ User created: ${userCredential.user.uid}`);
      
      // Test login
      await signInWithEmailAndPassword(auth, testEmail, testPassword);
      addTestResult('Email Auth', '✅ Login successful');
      
      // Sign out
      await auth.signOut();
      addTestResult('Email Auth', '✅ Sign out successful');
      
      setStatus('Email authentication test completed!');
      
    } catch (err) {
      setError(`Email auth test failed: ${err.message}`);
      addTestResult('Email Auth', '❌', err.message);
      console.error('Email auth test error:', err);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setError(null);
    setStatus('Ready to test Firebase connection...');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Firebase Connection Debugger</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          This tool will help debug Firebase connection issues. Click the buttons below to test different Firebase services.
        </p>
        
        <div className="flex gap-4 mb-4">
          <button 
            onClick={testFirebaseConnection}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Basic Connection
          </button>
          
          <button 
            onClick={testEmailAuth}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Email Auth
          </button>
          
          <button 
            onClick={clearResults}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Results
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Status: {status}</p>
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </div>
      </div>

      {testResults.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Test Results:</h3>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="font-mono text-xs text-gray-500 min-w-[80px]">
                  {result.timestamp}
                </span>
                <span className="font-medium min-w-[120px]">{result.test}:</span>
                <span className={result.error ? 'text-red-600' : 'text-gray-700'}>
                  {result.result}
                </span>
                {result.error && (
                  <div className="text-red-500 text-xs mt-1 ml-4">
                    Error: {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Troubleshooting Tips:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Make sure Authentication is enabled in Firebase Console</li>
          <li>• Check if Firestore Database is created</li>
          <li>• Verify the API key is correct</li>
          <li>• Ensure your Firebase project is not in a restricted region</li>
          <li>• Check browser console for additional error details</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseTest;
