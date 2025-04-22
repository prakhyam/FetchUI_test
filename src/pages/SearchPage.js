import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  Badge,
  Snackbar,
  Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  getBreeds, 
  searchDogs, 
  getDogs, 
  getMatch
} from '../api/fetchAPI';

import FilterPanel from '../components/FilterPanel';
import DogList from '../components/DogList';
import FavoritesList from '../components/FavoritesList';

const SearchPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  // State management
  const [allBreeds, setAllBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [sortOrder, setSortOrder] = useState('breed:asc');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [pageSize] = useState(20);
  
  const [favorites, setFavorites] = useState([]);
  const [favoriteDogs, setFavoriteDogs] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [matchId, setMatchId] = useState(null);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Load breeds on component mount
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedsData = await getBreeds();
        setAllBreeds(breedsData);
      } catch (err) {
        setError('Failed to load dog breeds');
        console.error('Error fetching breeds:', err);
      }
    };
    
    fetchBreeds();
    loadDogs();
  }, []);
  
  // Update favorite dogs whenever favorites change
  useEffect(() => {
    const fetchFavoriteDogs = async () => {
      if (favorites.length > 0) {
        try {
          const dogsData = await getDogs(favorites);
          setFavoriteDogs(dogsData);
        } catch (err) {
          console.error('Error fetching favorite dogs:', err);
        }
      } else {
        setFavoriteDogs([]);
      }
    };
    
    fetchFavoriteDogs();
  }, [favorites]);
  
  // Functions for handling search and filtering
  const loadDogs = async (
    cursor = null, 
    sort = sortOrder, 
    breeds = selectedBreeds, 
    minAge = ageMin, 
    maxAge = ageMax,
    locations = selectedLocations
  ) => {
    setLoading(true);
    setError('');
    
    try {
      const searchParams = {
        size: pageSize,
        sort: sort
      };
      
      if (breeds && breeds.length > 0) {
        searchParams.breeds = breeds;
      }
      
      if (minAge) {
        searchParams.ageMin = minAge;
      }
      
      if (maxAge) {
        searchParams.ageMax = maxAge;
      }
      
      // Add zip codes if locations are selected
      if (locations && locations.length > 0) {
        const allZipCodes = locations.flatMap(loc => {
          if (loc.zip_codes && loc.zip_codes.length > 0) {
            return loc.zip_codes;
          } else if (loc.zip_code) {
            return [loc.zip_code];
          }
          return [];
        });
      
        if (allZipCodes.length > 0) {
          searchParams.zipCodes = allZipCodes;
        }
      }
      
      
      // Handle pagination cursor properly
      if (cursor) {
        // Parse the cursor value if it's a string containing a URL query
        if (typeof cursor === 'string' && cursor.includes('from=')) {
          const fromMatch = cursor.match(/from=(\d+)/);
          if (fromMatch && fromMatch[1]) {
            searchParams.from = fromMatch[1];
          }
        } else {
          searchParams.from = cursor;
        }
      }
      
      const searchResults = await searchDogs(searchParams);
      
      setTotal(searchResults.total);
      setNextCursor(searchResults.next);
      setPrevCursor(searchResults.prev);
      setHasNext(!!searchResults.next);
      setHasPrev(!!searchResults.prev);
      
      if (searchResults.resultIds && searchResults.resultIds.length > 0) {
        const dogsData = await getDogs(searchResults.resultIds);
        setDogs(dogsData);
      } else {
        setDogs([]);
      }
    } catch (err) {
      setError('Failed to load dogs');
      console.error('Error fetching dogs:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = (newPage) => {
    if (newPage > currentPage && hasNext) {
      // Extract the cursor from the nextCursor string
      if (typeof nextCursor === 'string' && nextCursor.includes('from=')) {
        const fromMatch = nextCursor.match(/from=(\d+)/);
        if (fromMatch && fromMatch[1]) {
          loadDogs(fromMatch[1]);
        } else {
          loadDogs(nextCursor);
        }
      } else {
        loadDogs(nextCursor);
      }
      setCurrentPage(newPage);
    } else if (newPage < currentPage && hasPrev) {
      // Extract the cursor from the prevCursor string
      if (typeof prevCursor === 'string' && prevCursor.includes('from=')) {
        const fromMatch = prevCursor.match(/from=(\d+)/);
        if (fromMatch && fromMatch[1]) {
          loadDogs(fromMatch[1]);
        } else {
          loadDogs(prevCursor);
        }
      } else {
        loadDogs(prevCursor);
      }
      setCurrentPage(newPage);
    }
  };
  
  const handleApplyFilters = (localBreeds, localAgeMin, localAgeMax, localLocations) => {
    setCurrentPage(1);
    setSelectedBreeds(localBreeds);
    setAgeMin(localAgeMin);
    setAgeMax(localAgeMax);
    setSelectedLocations(localLocations);
    
    // Use the values passed directly from FilterPanel
    loadDogs(null, sortOrder, localBreeds, localAgeMin, localAgeMax, localLocations);
  };
  
  const handleSortChange = (newSort) => {
    setSortOrder(newSort);
    setCurrentPage(1);
    loadDogs(null, newSort);
  };
  
  // Functions for handling favorites
  const handleToggleFavorite = (dogId) => {
    if (favorites.includes(dogId)) {
      setFavorites(favorites.filter(id => id !== dogId));
      setSnackbar({
        open: true,
        message: 'Removed from favorites',
        severity: 'info'
      });
    } else {
      setFavorites([...favorites, dogId]);
      setSnackbar({
        open: true,
        message: 'Added to favorites',
        severity: 'success'
      });
    }
  };
  
  const handleRemoveFavorite = (dogId) => {
    setFavorites(favorites.filter(id => id !== dogId));
    setSnackbar({
      open: true,
      message: 'Removed from favorites',
      severity: 'info'
    });
  };
  
  const handleGenerateMatch = async () => {
    if (favorites.length === 0) return;
    
    try {
      setLoading(true);
      const match = await getMatch(favorites);
      setMatchId(match.match);
      localStorage.setItem('matchedDogId', match.match);
      return match.match;
    } catch (err) {
      setError('Failed to generate match');
      console.error('Error generating match:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fetch Dog Adoption
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentUser && (
              <Typography variant="body2" sx={{ mr: 2 }}>
                Hello, {currentUser.name}
              </Typography>
            )}
            
            <IconButton 
              color="inherit" 
              onClick={() => setShowFavorites(true)}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={favorites.length} color="secondary">
                <FavoriteIcon />
              </Badge>
            </IconButton>
            
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ py: 4, flexGrow: 1 }}>
        <FilterPanel 
          breeds={allBreeds}
          selectedBreeds={selectedBreeds}
          onBreedsChange={setSelectedBreeds}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          ageMin={ageMin}
          ageMax={ageMax}
          onAgeChange={(min, max) => {
            setAgeMin(min);
            setAgeMax(max);
          }}
          selectedLocations={selectedLocations}
          onLocationsChange={setSelectedLocations}
          onApplyFilters={handleApplyFilters}
        />
        
        <DogList 
          dogs={dogs}
          loading={loading}
          error={error}
          total={total}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          pageSize={pageSize}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      </Container>
      
      <FavoritesList 
        open={showFavorites}
        onClose={() => setShowFavorites(false)}
        favorites={favorites}
        favoriteDogs={favoriteDogs}
        onRemoveFavorite={handleRemoveFavorite}
        onGenerateMatch={handleGenerateMatch}
      />
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SearchPage;