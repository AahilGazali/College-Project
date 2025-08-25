import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { auth, db } from '../../firebase/config';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import BookIcon from '../icons/BookIcon';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'faculty'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [firebaseReady, setFirebaseReady] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Check if Firebase is properly loaded
  React.useEffect(() => {
    const checkFirebase = () => {
      if (auth && db) {
        setFirebaseReady(true);
        console.log('Firebase is ready for registration');
      } else {
        setFirebaseReady(false);
        console.error('Firebase is not ready. Auth:', !!auth, 'DB:', !!db);
        setError('Firebase is not properly configured. Please refresh the page.');
      }
    };

    // Check immediately
    checkFirebase();
    
    // Also check after a short delay to ensure Firebase has time to initialize
    const timer = setTimeout(checkFirebase, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading state while Firebase initializes
  if (!firebaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-200 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Initializing Firebase...</h2>
          <p className="text-gray-200">Please wait while we set up your registration system.</p>
          {error && (
            <div className="mt-4 p-3 bg-red-50/10 backdrop-blur-sm border border-red-200/20 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Additional safety checks to prevent auth errors
    if (!auth) {
      setError('Firebase authentication is not properly configured. Please refresh the page or contact support.');
      toast.error('Firebase configuration error. Please refresh the page.');
      console.error('Firebase auth object is not available');
      return;
    }

    if (!db) {
      setError('Firebase database is not properly configured. Please refresh the page or contact support.');
      toast.error('Firebase configuration error. Please refresh the page.');
      console.error('Firebase db object is not available');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      // Add debugging information
      console.log('Starting registration process...');
      console.log('Form data:', { ...formData, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });
      
      // Test Firebase connection first
      console.log('Testing Firebase connection...');
      console.log('Auth object:', auth);
      console.log('DB object:', db);
      
      const result = await signup(formData.email, formData.password, formData.name, formData.role);
      console.log('Registration successful:', result);
      
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error details:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error object:', error);
      
      // Enhanced error handling with user-friendly messages
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please try logging in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format. Please check your email.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters with a mix of letters, numbers, and symbols.';
      } else if (error.code === 'auth/api-key-not-valid') {
        errorMessage = 'Firebase configuration error. Please contact the administrator or check the setup guide.';
        console.error('🔥 FIREBASE CONFIGURATION ERROR 🔥');
        console.error('The Firebase API key is invalid. Please check FIREBASE_SETUP.md for setup instructions.');
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please wait a few minutes before trying again.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password authentication is not enabled. Please contact the administrator.';
      } else if (error.message && error.message.includes('auth is not defined')) {
        errorMessage = 'System configuration error. Please refresh the page or contact support.';
        console.error('CRITICAL: Auth object is not defined. This should not happen with proper imports.');
      } else if (error.message) {
        errorMessage = `Registration failed: ${error.message}`;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 bg-gradient-secondary rounded-xl flex items-center justify-center shadow-primary-lg">
            <BookIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Join EduGen AI
          </h2>
          <p className="mt-2 text-center text-gray-200">
            Create your account and start generating AI-powered question papers
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium focus:z-10 text-sm shadow-sm input-gradient"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium focus:z-10 text-sm shadow-sm input-gradient"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-white mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium sm:text-sm rounded-lg shadow-sm input-gradient"
              >
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium focus:z-10 text-sm shadow-sm input-gradient"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium focus:z-10 text-sm shadow-sm input-gradient"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center p-4 text-sm text-red-800 border border-red-200 rounded-lg bg-red-50">
              <AlertCircle className="h-4 w-4 mr-3" />
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 px-4 text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-200">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-200 hover:text-primary-100 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 