import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage, db, auth } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

const FirebaseTest = () => {
  const { currentUser } = useAuth();
  const [testResults, setTestResults] = useState({});

  const runTests = async () => {
    const results = {};
    
    try {
      // Test 1: Check if user is authenticated
      results.auth = currentUser ? `Authenticated: ${currentUser.uid}` : 'Not authenticated';
      
      // Test 2: Check Firebase services
      results.storage = storage ? 'Storage service available' : 'Storage service not available';
      results.db = db ? 'Database service available' : 'Database service not available';
      
      // Test 3: Try to write to Firestore
      if (currentUser && db) {
        try {
          const testDoc = {
            userId: currentUser.uid,
            test: true,
            timestamp: new Date().toISOString()
          };
          const docRef = await addDoc(collection(db, 'test'), testDoc);
          results.firestoreWrite = `Success: ${docRef.id}`;
          
          // Clean up test document
          // Note: In production, you'd want to delete this
        } catch (error) {
          results.firestoreWrite = `Error: ${error.message}`;
        }
      } else {
        results.firestoreWrite = 'Skipped: No user or DB';
      }
      
      // Test 4: Try to read from Firestore
      if (currentUser && db) {
        try {
          const querySnapshot = await getDocs(collection(db, 'documents'));
          results.firestoreRead = `Success: ${querySnapshot.size} documents found`;
        } catch (error) {
          results.firestoreRead = `Error: ${error.message}`;
        }
      } else {
        results.firestoreRead = 'Skipped: No user or DB';
      }
      
      // Test 5: Try to upload a small test file
      if (currentUser && storage) {
        try {
          const testBlob = new Blob(['Test file content'], { type: 'text/plain' });
          const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
          const storageRef = ref(storage, `test/${currentUser.uid}/test.txt`);
          await uploadBytes(storageRef, testFile);
          const downloadURL = await getDownloadURL(storageRef);
          results.storageUpload = `Success: ${downloadURL}`;
        } catch (error) {
          results.storageUpload = `Error: ${error.message}`;
        }
      } else {
        results.storageUpload = 'Skipped: No user or Storage';
      }
      
    } catch (error) {
      results.general = `General error: ${error.message}`;
    }
    
    setTestResults(results);
    console.log('Firebase test results:', results);
  };

  useEffect(() => {
    runTests();
  }, [currentUser]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
      
      <button
        onClick={runTests}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Run Tests
      </button>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test Results:</h2>
        {Object.entries(testResults).map(([test, result]) => (
          <div key={test} className="mb-2">
            <span className="font-medium">{test}:</span> {result}
          </div>
        ))}
      </div>
      
      <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Debug Info:</h2>
        <p><strong>Current User:</strong> {currentUser ? currentUser.uid : 'None'}</p>
        <p><strong>Storage:</strong> {storage ? 'Available' : 'Not available'}</p>
        <p><strong>Database:</strong> {db ? 'Available' : 'Not available'}</p>
        <p><strong>Auth:</strong> {auth ? 'Available' : 'Not available'}</p>
      </div>
    </div>
  );
};

export default FirebaseTest;
