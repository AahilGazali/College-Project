import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestNavigation = () => {
  const navigate = useNavigate();

  const testNavigation = (path) => {
    console.log(`Testing navigation to: ${path}`);
    try {
      navigate(path);
    } catch (error) {
      console.error(`Navigation error to ${path}:`, error);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Navigation Test</h2>
      <div className="space-y-4">
        <button
          onClick={() => testNavigation('/login')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Login Navigation
        </button>
        <button
          onClick={() => testNavigation('/register')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Register Navigation
        </button>
        <button
          onClick={() => testNavigation('/')}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test Home Navigation
        </button>
      </div>
    </div>
  );
};

export default TestNavigation; 