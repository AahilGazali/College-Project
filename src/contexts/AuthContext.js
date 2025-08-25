import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

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

  // Sign up function
  const signup = async (email, password, name, role) => {
    try {
      console.log('AuthContext: Starting signup process...');
      console.log('AuthContext: Email:', email);
      console.log('AuthContext: Name:', name);
      console.log('AuthContext: Role:', role);
      console.log('AuthContext: Auth object:', auth);
      console.log('AuthContext: DB object:', db);
      
      console.log('AuthContext: Creating user with email and password...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('AuthContext: User created successfully:', user.uid);
      
      console.log('AuthContext: Updating profile with display name...');
      await updateProfile(user, { displayName: name });
      console.log('AuthContext: Profile updated successfully');
      
      console.log('AuthContext: Storing user data in Firestore...');
      const userData = {
        uid: user.uid,
        email: user.email,
        name: name,
        role: role, // 'admin' or 'faculty'
        createdAt: new Date().toISOString(),
        isActive: true
      };
      console.log('AuthContext: User data to store:', userData);
      
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('AuthContext: User data stored in Firestore successfully');
      
      return user;
    } catch (error) {
      console.error('AuthContext: Signup error:', error);
      console.error('AuthContext: Error code:', error.code);
      console.error('AuthContext: Error message:', error.message);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    return signOut(auth);
  };

  // Get user role from Firestore
  const getUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data().role;
      }
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const role = await getUserRole(user.uid);
        setUserRole(role);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 