import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { useNavigate } from 'react-router-dom';

const MatchResult = ({ matchedDog, onRestartSearch, matchError }) => {
  const navigate = useNavigate();
  
  // Handle the case when no match is found or there's an error
  if (matchError) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Match Found
          </Typography>
          <Alert severity="info" sx={{ mb: 3, mx: 'auto', maxWidth: '80%' }}>
            {matchError || "We couldn't find a dog that matches your requirements. Try adjusting your favorites or filter criteria."}
          </Alert>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/search')}
            >
              Return to Search
            </Button>
            <Button 
              variant="contained" 
              onClick={onRestartSearch}
            >
              Try Again
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }
  
  if (!matchedDog) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="text.secondary">
          Loading your match...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            It's a Match!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Meet your new best friend
          </Typography>
        </Box>
        
        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            height="300"
            image={matchedDog.img}
            alt={matchedDog.name}
            sx={{ objectFit: 'cover' }}
          />

          {/* Dog Name and Favorite Icon */}
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <Typography variant="h5" component="div" sx={{ mr: 1 }}>
                {matchedDog.name}
              </Typography>
              <FavoriteIcon color="secondary" />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Chip 
                label={matchedDog.breed} 
                color="primary" 
                variant="outlined" 
                sx={{ mr: 1 }}
              />
              <Chip 
                label={`${matchedDog.age} ${matchedDog.age === 1 ? 'year' : 'years'} old`} 
                color="primary" 
                variant="outlined" 
              />
            </Box>
            
            {/* Location display */}
            <Typography variant="body1">
              Location: {matchedDog.zip_code}
            </Typography>
          </CardContent>
        </Card>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={onRestartSearch}
          >
            Search Again
          </Button>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => {
              alert(`Thank you for choosing to adopt ${matchedDog.name}! In a real application, this would start the adoption process.`);
            }}
          >
            Adopt Me!
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default MatchResult;