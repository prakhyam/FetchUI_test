import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  CircularProgress, 
  Container
} from '@mui/material';
import DogCard from './DogCard';
import Pagination from './Pagination';
import { getLocations } from '../api/fetchAPI';

const DogList = ({ 
  dogs, 
  loading, 
  error, 
  total,
  favorites, 
  onToggleFavorite,
  onPageChange,
  currentPage,
  pageSize,
  hasNext,
  hasPrev
}) => {
  const [locationData, setLocationData] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Fetching city/state info for unique ZIP codes from the dog list
  useEffect(() => {
    const fetchLocationData = async () => {
      if (!dogs || dogs.length === 0) return;
      
      const zipCodes = [...new Set(dogs.map(dog => dog.zip_code))];
      if (zipCodes.length === 0) return;
      
      setLoadingLocations(true);
      try {
        const locationsData = await getLocations(zipCodes);
        setLocationData(locationsData);
      } catch (err) {
        console.error('Error fetching location data:', err);
      } finally {
        setLoadingLocations(false);
      }
    };
    
    fetchLocationData();
  }, [dogs]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (dogs.length === 0) {
    return (
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h6">
          No dogs found with the current filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">
          Showing {dogs.length} of {total} results
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {dogs.map((dog) => (
          <Grid item key={dog.id} xs={12} sm={6} md={4} lg={3}>
            <DogCard 
              dog={dog} 
              isFavorite={favorites.includes(dog.id)}
              onToggleFavorite={onToggleFavorite}
              locationData={locationData}
            />
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Pagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      </Box>
    </Container>
  );
};

export default DogList;