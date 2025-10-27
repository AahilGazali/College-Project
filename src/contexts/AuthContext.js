import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await authAPI.getCurrentUser();
          setCurrentUser(response.user);
          setUserRole(response.user.role);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Sign up function
  const signup = async (email, password, name, role) => {
    try {
      console.log('AuthContext: Starting signup process...');
      console.log('AuthContext: Email:', email);
      console.log('AuthContext: Name:', name);
      console.log('AuthContext: Role:', role);
      
      const response = await authAPI.register({
        email,
        password,
        name,
        role
      });
      
      console.log('AuthContext: Registration successful:', response);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      setCurrentUser(response.user);
      setUserRole(response.user.role);
      
      return response.user;
    } catch (error) {
      console.error('AuthContext: Signup error:', error);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      console.log('AuthContext: Starting login process...');
      
      const response = await authAPI.login({
        email,
        password
      });
      
      console.log('AuthContext: Login successful:', response);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      setCurrentUser(response.user);
      setUserRole(response.user.role);
      
      return response.user;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of API call success
      localStorage.removeItem('token');
      setCurrentUser(null);
      setUserRole(null);
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authAPI.changePassword({
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      localStorage.setItem('token', response.token);
      return response.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      logout();
      throw error;
    }
  };

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    changePassword,
    refreshToken,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 