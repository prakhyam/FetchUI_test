import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDogs } from '../api/fetchAPI';
import MatchResult from '../components/MatchResult';

const MatchPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  const [matchedDog, setMatchedDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchMatchedDog = async () => {
      try {
        setLoading(true);
        const matchedDogId = localStorage.getItem('matchedDogId');
        
        if (!matchedDogId) {
          navigate('/search');
          return;
        }
        
        const dogsData = await getDogs([matchedDogId]);
        if (dogsData && dogsData.length > 0) {
          setMatchedDog(dogsData[0]);
        }
      } catch (err) {
        setError('Failed to load matched dog');
        console.error('Error fetching matched dog:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatchedDog();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };
  
  const handleRestartSearch = () => {
    navigate('/search');
  };
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => navigate('/search')}
            edge="start"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Your Perfect Match
          </Typography>
          
          {currentUser && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Hello, {currentUser.name}
              </Typography>
              
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8, mb: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', my: 8 }}>
            <Typography color="error" variant="h6">
              {error}
            </Typography>
          </Box>
        ) : (
          <MatchResult 
            matchedDog={matchedDog} 
            onRestartSearch={handleRestartSearch} 
          />
        )}
      </Container>
    </Box>
  );
};

export default MatchPage;