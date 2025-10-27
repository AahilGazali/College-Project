import React from 'react';
import { createBrowserRouter, RouterProvider, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import UploadDocuments from './components/upload/UploadDocuments';
import QuestionGenerator from './components/generate/QuestionGenerator';
import LandingPage from './components/landing/LandingPage';
import ErrorBoundary from './components/ErrorBoundary';
import Settings from './components/settings/Settings';
import SmoothScroll from './components/SmoothScroll';
import PaperManagement from './components/papers/PaperManagement';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { currentUser, userRole, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return currentUser && userRole === 'admin' ? children : <Navigate to="/dashboard" />;
};

// Define your routes here
const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/upload',
    element: (
      <ProtectedRoute>
        <UploadDocuments />
      </ProtectedRoute>
    ),
  },
  {
    path: '/generate',
    element: (
      <ProtectedRoute>
        <QuestionGenerator />
      </ProtectedRoute>
    ),
  },
  {
    path: '/papers',
    element: (
      <ProtectedRoute>
        <PaperManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <Settings />
      </AdminRoute>
    ),
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DashboardProvider>
          <RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true }} />
        </DashboardProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;