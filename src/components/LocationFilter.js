import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  CircularProgress,
  Autocomplete,
  Typography,
  Chip,
  Button
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import { searchLocations } from '../api/fetchAPI';

// Known locations with dogs 
const KNOWN_LOCATIONS = [
  { city: 'San Antonio', state: 'TX' },
  { city: 'Burlington Junction', state: 'MO' },
  { city: 'New Haven', state: 'CT' },
];

const LocationFilter = ({ selectedLocations, onLocationsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [manualEntry, setManualEntry] = useState(null);

  useEffect(() => {
    if (open && options.length === 0) {
      loadInitialLocations();
    }
  }, [open]);

  const loadInitialLocations = async () => {
    setLoading(true);
    try {
      // Popular cities
      const popularCities = ['San Antonio', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'New Haven', 'Burlington'];
      
      const knownLocationResults = [];
      for (const loc of KNOWN_LOCATIONS) {
        const response = await searchLocations({ 
          city: loc.city, 
          states: loc.state ? [loc.state] : undefined,
          size: 20 
        });
        
        if (response?.results?.length) {
          knownLocationResults.push(...response.results);
        } else {
          knownLocationResults.push({
            city: loc.city,
            state: loc.state,
            zip_code: 'Unknown',
            zip_codes: ['Unknown'],
            isManualEntry: true
          });
        }
      }

      const cityResults = [];
      for (const city of popularCities) {
        const response = await searchLocations({ city, size: 30 });
        if (response?.results?.length) {
          cityResults.push(...response.results);
        }
      }

      const stateResponse = await searchLocations({ 
        states: ['TX', 'CA', 'NY', 'FL', 'MO', 'CT'], 
        size: 30 
      });
      
      const allResults = [
        ...knownLocationResults,
        ...cityResults,
        ...(stateResponse?.results || [])
      ];
      
      const grouped = groupLocationsByCityState(allResults);
      setOptions(grouped);
    } catch (e) {
      console.error('Error loading initial locations:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async (searchText) => {
    if (!searchText || searchText.length < 2) return;
    
    setLoading(true);
    setManualEntry(null);
    
    try {
      const results = [];
      const searchParams = [];
      
      // City search 
      searchParams.push({ city: searchText, size: 50 });
      
      //City search with partial matching
      const words = searchText.split(/\s+/);
      if (words.length > 1) {
        searchParams.push({ city: words[0], size: 50 });
      }
      
      //State 
      const stateMatches = /^(.+),\s*([A-Za-z]{2})$/.exec(searchText);
      if (stateMatches) {
        const [, cityPart, statePart] = stateMatches;
        searchParams.push({
          city: cityPart.trim(),
          states: [statePart.toUpperCase()],
          size: 50
        });
      }
      
      // ZIP code 
      if (/^\d{1,5}$/.test(searchText)) {
        searchParams.push({ zipCodes: [searchText], size: 30 });
      }
      
      //State code 
      if (/^[A-Za-z]{2}$/.test(searchText)) {
        searchParams.push({ states: [searchText.toUpperCase()], size: 50 });
      }
      
      for (const params of searchParams) {
        try {
          const response = await searchLocations(params);
          if (response?.results?.length) {
            results.push(...response.results);
          }
        } catch (err) {
          console.error('Search request failed:', err);
        }
      }
      
      const searchLower = searchText.toLowerCase();
      const matchingKnownLocations = KNOWN_LOCATIONS.filter(loc => {
        const cityMatch = loc.city.toLowerCase().includes(searchLower);
        const stateMatch = loc.state.toLowerCase() === searchLower;
        const combinedMatch = `${loc.city}, ${loc.state}`.toLowerCase().includes(searchLower);
        return cityMatch || stateMatch || combinedMatch;
      });
      
      for (const knownLoc of matchingKnownLocations) {
        const alreadyIncluded = results.some(r => 
          r.city.toLowerCase() === knownLoc.city.toLowerCase() && 
          r.state === knownLoc.state
        );
        
        if (!alreadyIncluded) {
          results.push({
            city: knownLoc.city,
            state: knownLoc.state,
            zip_code: 'Unknown',
            zip_codes: ['Unknown'],
            isManualEntry: true
          });
        }
      }
      
      const exactMatch = searchText.includes(',') && 
        results.some(r => `${r.city}, ${r.state}`.toLowerCase() === searchText.toLowerCase());
      
      if (searchText.length >= 3 && (results.length === 0 || !exactMatch)) {
        const parts = searchText.split(',').map(p => p.trim());
        
        const manualEntryOption = {
          city: parts[0],
          state: parts.length > 1 ? parts[1] : '',
          zip_code: 'Custom',
          zip_codes: ['Custom'],
          isManualEntry: true
        };
        
        setManualEntry(manualEntryOption);
      }
      
      const grouped = groupLocationsByCityState(results);
      setOptions(grouped);
    } catch (e) {
      console.error('Location search error:', e);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const groupLocationsByCityState = (locations) => {
    const grouped = {};
    
    locations.forEach(loc => {
      if (!loc.city) return;
      
      const key = `${loc.city.trim()}-${loc.state || ''}`.toLowerCase();
      if (!grouped[key]) {
        grouped[key] = {
          ...loc,
          zip_codes: loc.zip_codes || [loc.zip_code || 'Unknown'],
          city: loc.city.trim(), 
          state: loc.state || '',
          isManualEntry: loc.isManualEntry || false
        };
      } else if (loc.zip_code && !grouped[key].zip_codes.includes(loc.zip_code)) {
        grouped[key].zip_codes.push(loc.zip_code);
      }
    });
    
    return Object.values(grouped);
  };

  const handleAddManualLocation = () => {
    if (manualEntry) {
      onLocationsChange([...selectedLocations, manualEntry]);
      setManualEntry(null);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    let timer;
    if (searchTerm) {
      timer = setTimeout(() => {
        handleLocationSearch(searchTerm);
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <Box>
      
      <Autocomplete
        multiple
        id="location-autocomplete"
        options={options}
        loading={loading}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionLabel={(option) => `${option.city}${option.state ? ', ' + option.state : ''}`}
        filterOptions={(x) => x}
        value={selectedLocations}
        onChange={(e, newValue) => onLocationsChange(newValue)}
        isOptionEqualToValue={(option, value) =>
          option.city === value.city && option.state === value.state
        }
        groupBy={(option) => option.state || 'Other'}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={`${option.city}${option.state ? ', ' + option.state : ''}`}
              icon={<LocationOnIcon />}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Locations"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="City, State or ZIP"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...restProps } = props;
          
          return (
            <li key={key} {...restProps}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                width: '100%',
                ...(option.isManualEntry ? { fontStyle: 'italic' } : {})
              }}>
                <LocationOnIcon 
                  fontSize="small" 
                  sx={{ mr: 1, color: option.isManualEntry ? 'text.secondary' : 'primary.main' }} 
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2">
                    {option.city}{option.state ? ', ' + option.state : ''}
                    {option.isManualEntry && ' (Manual Entry)'}
                  </Typography>
                  {!option.isManualEntry && (
                    <Typography variant="caption" color="text.secondary">
                      {option.zip_codes.length > 1
                        ? `${option.zip_codes.length} ZIP codes`
                        : option.zip_codes[0]}
                    </Typography>
                  )}
                </Box>
              </Box>
            </li>
          );
        }}
      />

      {manualEntry && (
        <Box sx={{ mt: 1, p: 1, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="body2">
            Location not found? Add:{' '}
            <strong>{manualEntry.city}{manualEntry.state ? ', ' + manualEntry.state : ''}</strong>
          </Typography>
          <Button 
            startIcon={<SearchIcon />}
            size="small" 
            variant="outlined" 
            onClick={handleAddManualLocation}
            sx={{ mt: 1 }}
          >
            Add Custom Location
          </Button>
        </Box>
      )}

      {!loading && options.length === 0 && searchTerm.length > 2 && !manualEntry && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No locations found for "{searchTerm}"
        </Typography>
      )}
    </Box>
  );
};

export default LocationFilter;