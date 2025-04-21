import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Avatar,
  Alert
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {

    //regex to check if email format is correct
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate form if name is filled
    if (!name.trim()) {
      setFormError('Please enter your name');
      return;
    }

    // Check if email is filled in and valid
    if (!email.trim() || !validateEmail(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // login
    const result = await login(name, email);
    if (result.success) {
      navigate('/search');
    }
  };

  return (
    <Paper elevation={6} sx={{ p: 5, maxWidth: 450, width: '100%', borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f4f8)'}}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PetsIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Fetch Dog Adoption
        </Typography>
      </Box>
      
      {(error || formError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError || error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Your Name"
          name="name"
          autoComplete="name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Find Your Perfect Dog
        </Button>
      </Box>
    </Paper>
  );
};

export default LoginForm;