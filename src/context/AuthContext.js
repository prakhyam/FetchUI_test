import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/fetchAPI';
import api from '../api/fetchAPI';

//authentication context
const AuthContext = createContext();

// hook to allow access to the auth context from any component
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user info is stored in localStorage
    const storedUser = localStorage.getItem('user');
    
    const verifySession = async () => {
      if (storedUser) {
        try {
          // Make a simple API call to verify the session is still valid
          // We'll use the getBreeds endpoint as a lightweight check
          await api.get('/dogs/breeds');
          setCurrentUser(JSON.parse(storedUser));
        } catch (err) {
          // If API call fails with 401, session is invalid
          console.log('Session expired or invalid, redirecting to login');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (name, email) => {
    try {
      setError('');
      setLoading(true);

      // Send login request to backend
      await apiLogin(name, email);

      // If successful, store user info locally
      const userData = { name, email };
      setCurrentUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      setError('Failed to login. Please check your information and try again.');
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Call logout endpoint to clear server session
      await apiLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local state and storage, even if API call fails
      setCurrentUser(null);
      localStorage.removeItem('user');
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;