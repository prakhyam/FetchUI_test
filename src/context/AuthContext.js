import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/fetchAPI';
import api from '../api/fetchAPI';

//authentication context
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Checking if user info is stored in localStorage
    const storedUser = localStorage.getItem('user');
    
    const verifySession = async () => {
      if (storedUser) {
        try {
      
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

      await apiLogin(name, email);

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

      await apiLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
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