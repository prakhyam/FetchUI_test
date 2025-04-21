import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  Badge,
  Drawer,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const FavoritesList = ({ 
  open, 
  onClose, 
  favorites, 
  favoriteDogs, 
  onRemoveFavorite,
  onGenerateMatch
}) => {
  const navigate = useNavigate();
  
  const handleGenerateMatch = () => {
    onClose();
    onGenerateMatch();
    navigate('/match');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Badge badgeContent={favorites.length} color="secondary">
            <Typography variant="h6" component="div">
              <FavoriteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Your Favorites
            </Typography>
          </Badge>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {favorites.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              You haven't added any favorites yet.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Browse dogs and click the heart icon to add them here.
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ mb: 2 }}>
              {favoriteDogs.map((dog) => (
                <ListItem key={dog.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar 
                      variant="rounded" 
                      src={dog.img}
                      alt={dog.name}
                      sx={{ width: 60, height: 60, mr: 1 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={dog.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {dog.breed}
                        </Typography>
                        {` — ${dog.age} ${dog.age === 1 ? 'year' : 'years'} old`}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="remove" 
                      onClick={() => onRemoveFavorite(dog.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<FavoriteIcon />}
                onClick={handleGenerateMatch}
                disabled={favorites.length === 0}
                fullWidth
              >
                Find My Match
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default FavoritesList;