import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box,
  Chip
} from '@mui/material';

//icons for favourite button - toggle
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const DogCard = ({ dog, isFavorite, onToggleFavorite }) => {
  const { id, img, name, age, zip_code, breed } = dog;

  return (
    <Card 
  className={`dog-card ${isFavorite ? 'favorited' : ''}`}
  sx={{ 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column',
    position: 'relative',
    overflow: 'visible',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
    }
  }}
>
      <CardMedia
        component="img"
        height="200"
        image={img}
        alt={name}
        sx={{ objectFit: 'cover' }}
      />
      
      <Button
        onClick={() => onToggleFavorite(id)}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          minWidth: 'auto',
          borderRadius: '50%',
          width: 40,
          height: 40,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }
        }}
      >
        {/* favorite status */}
        {isFavorite ? 
          <FavoriteIcon color="secondary" /> : 
          <FavoriteBorderIcon />
        }
      </Button>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Age:</strong> {age} {age === 1 ? 'year' : 'years'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            <strong>Location:</strong> {zip_code}
          </Typography>
          
          <Box sx={{ mt: 1 }}>
            <Chip 
              label={breed} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DogCard;