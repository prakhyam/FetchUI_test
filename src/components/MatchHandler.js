import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import MatchResult from './MatchResult';
import { generateMatch } from '../api/fetchAPI'; 

const MatchHandler = ({ favorites }) => {
  const [loading, setLoading] = useState(true);
  const [matchedDog, setMatchedDog] = useState(null);
  const [matchError, setMatchError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (favorites && favorites.length > 0) {
      fetchMatch();
    } else {
      setLoading(false);
      setMatchError("You need to add some dogs to your favorites list first");
    }
  }, [favorites]);

  const fetchMatch = async () => {
    setLoading(true);
    setMatchError(null);
    
    try {
      if (!favorites || favorites.length === 0) {
        setMatchError("Please add some dogs to your favorites before finding a match");
        setLoading(false);
        return;
      }
      
      const matchResult = await generateMatch(favorites);
      
      if (matchResult && matchResult.match) {
        setMatchedDog(matchResult.match);
      } else {
        setMatchError("No dogs matched your requirements. Try adding more varieties to your favorites.");
      }
    } catch (error) {
      console.error("Error generating match:", error);
      setMatchError(
        error.message || "There was an error finding your match. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRestartSearch = () => {
    navigate('/search');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <MatchResult 
      matchedDog={matchedDog}
      matchError={matchError}
      onRestartSearch={handleRestartSearch}
    />
  );
};

export default MatchHandler;