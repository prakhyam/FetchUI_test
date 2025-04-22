import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box,
  Chip,
  Tooltip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const DogCard = ({ dog, isFavorite, onToggleFavorite, locationData }) => {
  const { id, img, name, age, zip_code, breed } = dog;

  // fromatted location (city, state) if available, otherwise fallback to zip
  const location = locationData && locationData.length > 0 ? 
    locationData.find(loc => loc.zip_code === zip_code) : null;
  
  const locationDisplay = location ? 
    `${location.city}, ${location.state}` : 
    zip_code;

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
          
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Tooltip title={`ZIP: ${zip_code}`} arrow placement="top">
              <span>{locationDisplay}</span>
            </Tooltip>
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