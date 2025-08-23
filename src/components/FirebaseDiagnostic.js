import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const FirebaseDiagnostic = () => {
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpass123');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testRegistration = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('Testing Firebase registration...');
      console.log('Email:', testEmail);
      console.log('Password:', testPassword);
      
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      
      setResult(`✅ SUCCESS! User created with ID: ${userCredential.user.uid}`);
      console.log('Registration successful:', userCredential);
      
      // Clean up - delete the test user
      await userCredential.user.delete();
      setResult(prev => prev + '\n\n🧹 Test user cleaned up automatically.');
      
    } catch (error) {
      const errorMessage = `❌ ERROR: ${error.code} - ${error.message}`;
      setResult(errorMessage);
      console.error('Registration test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Firebase Diagnostic Tool</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Test Email:</label>
        <input
          type="email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Test Password:</label>
        <input
          type="password"
          value={testPassword}
          onChange={(e) => setTestPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <button
        onClick={testRegistration}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Firebase Registration'}
      </button>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-yellow-50 rounded">
        <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Go to Firebase Console → Authentication → Sign-in method</li>
          <li>Enable "Email/Password" authentication</li>
          <li>Check if your API key is correct in the config</li>
          <li>Ensure your Firebase project is not in a restricted region</li>
          <li>Check browser console for additional error details</li>
        </ol>
      </div>
    </div>
  );
};

export default FirebaseDiagnostic;
