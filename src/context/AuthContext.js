import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/fetchAPI';

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
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
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

      // Clearing local state and storage
      setCurrentUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      setError('Failed to logout');
    } finally {
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
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;