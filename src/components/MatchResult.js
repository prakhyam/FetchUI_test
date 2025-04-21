import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Card,
  CardMedia,
  CardContent,
  Chip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';

const MatchResult = ({ matchedDog, onRestartSearch }) => {
  const navigate = useNavigate();
  
  if (!matchedDog) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="text.secondary">
          No match found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/search')}
          sx={{ mt: 2 }}
        >
          Return to Search
        </Button>
      </Box>
    );
  }

  // eslint-disable-next-line no-lone-blocks
  {/* Displaying match result when a dog is found */}
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

      {/*Dog Name and Favorite Icon*/}
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
            
            {/* Location display*/}
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
              // In a real app, this would initiate the adoption process
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