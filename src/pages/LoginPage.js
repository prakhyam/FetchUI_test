import React, { useEffect } from 'react';
import { Box, Container } from '@mui/material';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to /search page, if already logged in
    if (currentUser) {
      navigate('/search');
    }
  }, [currentUser, navigate]);

  return (
    <Box className="login-container">
      <Container maxWidth="sm">
        <LoginForm />
      </Container>
    </Box>
  );
};

export default LoginPage;