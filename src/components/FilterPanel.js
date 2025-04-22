import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Button,
  Grid,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SortSelector from './SortSelector';
import LocationFilter from './LocationFilter';

const ITEM_HEIGHT = 20;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const FilterPanel = ({ 
  breeds, 
  selectedBreeds, 
  onBreedsChange,
  sortOrder,
  onSortChange,
  ageMin,
  ageMax,
  onAgeChange,
  selectedLocations,
  onLocationsChange,
  onApplyFilters
}) => {
  const [localBreeds, setLocalBreeds] = useState(selectedBreeds);
  const [localAgeMin, setLocalAgeMin] = useState(ageMin);
  const [localAgeMax, setLocalAgeMax] = useState(ageMax);
  const [localLocations, setLocalLocations] = useState(selectedLocations || []);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'warning'
  });

  const handleBreedChange = (event) => {
    const {
      target: { value },
    } = event;
    setLocalBreeds(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleLocationChange = (newLocations) => {
    setLocalLocations(newLocations);
  };

  // age validation for minimum age
  const handleAgeMinChange = (e) => {
    const inputValue = e.target.value;
    
    if (inputValue === '') {
      setLocalAgeMin('');
      return;
    }
    
    const value = Number(inputValue);
    
    // Validate non-negative
    if (value < 0) {
      setLocalAgeMin(0);
      setSnackbar({
        open: true,
        message: 'Age cannot be negative',
        severity: 'warning'
      });
      return;
    }
    
    // Validate integer
    if (!Number.isInteger(value) && inputValue !== '') {
      setLocalAgeMin(Math.floor(value));
      setSnackbar({
        open: true,
        message: 'Age must be a whole number',
        severity: 'info'
      });
      return;
    }
    
    // Validate relationship to max age
    if (localAgeMax !== '' && value > Number(localAgeMax)) {
      setLocalAgeMin(localAgeMax);
      setSnackbar({
        open: true,
        message: 'Minimum age cannot be greater than maximum age',
        severity: 'warning'
      });
      return;
    }
    
    if (value > 30) {
      setSnackbar({
        open: true,
        message: 'Warning: Dogs rarely live beyond 30 years',
        severity: 'info'
      });
    }
    
    setLocalAgeMin(value);
  };

  // Enhanced age validation for maximum age
  const handleAgeMaxChange = (e) => {
    const inputValue = e.target.value;
    
    // empty input
    if (inputValue === '') {
      setLocalAgeMax('');
      return;
    }
    
    const value = Number(inputValue);
    
    // Validate non-negative
    if (value < 0) {
      setLocalAgeMax(0);
      setSnackbar({
        open: true,
        message: 'Age cannot be negative',
        severity: 'warning'
      });
      return;
    }
    
    if (!Number.isInteger(value) && inputValue !== '') {
      setLocalAgeMax(Math.floor(value));
      setSnackbar({
        open: true,
        message: 'Age must be a whole number',
        severity: 'info'
      });
      return;
    }
    
    if (localAgeMin !== '' && value < Number(localAgeMin)) {
      setLocalAgeMax(localAgeMin);
      setSnackbar({
        open: true,
        message: 'Maximum age cannot be less than minimum age',
        severity: 'warning'
      });
      return;
    }
    
    if (value > 30) {
      setSnackbar({
        open: true,
        message: 'Warning: Dogs rarely live beyond 30 years',
        severity: 'info'
      });
    }
    
    setLocalAgeMax(value);
  };

  const handleApplyFilters = () => {
    let hasErrors = false;
    
    if (localAgeMin !== '' && localAgeMax !== '' && Number(localAgeMin) > Number(localAgeMax)) {
      setSnackbar({
        open: true,
        message: 'Minimum age cannot be greater than maximum age',
        severity: 'error'
      });
      hasErrors = true;
    }
    
    if (!hasErrors) {
      onBreedsChange(localBreeds);
      onAgeChange(localAgeMin, localAgeMax);
      onLocationsChange(localLocations);
      onApplyFilters(localBreeds, localAgeMin, localAgeMax, localLocations);
    }
  };

  const handleResetFilters = () => {
    setLocalBreeds([]);
    setLocalAgeMin('');
    setLocalAgeMax('');
    setLocalLocations([]);
    onBreedsChange([]);
    onAgeChange('', '');
    onLocationsChange([]);
    onApplyFilters([], '', '', []);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const paperStyle = {
    p: 2, 
    mb: 3,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
  };

  const accordionStyle = {
    boxShadow: 'none',
    border: '1px solid #e0e0e0',
    '&:before': {
      display: 'none',
    },
    borderRadius: '4px',
    height: '100%', 
  };

  const accordionSummaryStyle = {
    minHeight: '48px', 
    padding: '0 16px',
    '&.Mui-expanded': {
      minHeight: '48px',
    }
  };

  const accordionDetailsStyle = {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  };

  
  const gridItemStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Paper elevation={1} sx={paperStyle}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
        Search Filters
      </Typography>
      
      <Grid container spacing={2}>
        {/* Breed Filter */}
        <Grid item xs={8} md={4} sx={gridItemStyle}>
          <Accordion defaultExpanded disableGutters sx={accordionStyle}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="breed-filter-content"
              id="breed-filter-header"
              sx={accordionSummaryStyle}
            >
              <Typography>Breed</Typography>
            </AccordionSummary>
            <AccordionDetails sx={accordionDetailsStyle}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Search Breed
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="breed-multiple-checkbox-label">Breeds</InputLabel>
                <Select
                  labelId="breed-multiple-checkbox-label"
                  id="breed-multiple-checkbox"
                  multiple
                  value={localBreeds}
                  onChange={handleBreedChange}
                  input={<OutlinedInput label="Breeds" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {breeds.map((breed) => (
                    <MenuItem key={breed} value={breed}>
                      <Checkbox checked={localBreeds.indexOf(breed) > -1} />
                      <ListItemText primary={breed} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Age Filter */}
        <Grid item xs={12} md={4} sx={gridItemStyle}>
          <Accordion defaultExpanded disableGutters sx={accordionStyle}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="age-filter-content"
              id="age-filter-header"
              sx={accordionSummaryStyle}
            >
              <Typography>Age</Typography>
            </AccordionSummary>
            <AccordionDetails sx={accordionDetailsStyle}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Filter by Age
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Min Age"
                    type="number"
                    size="small"
                    InputProps={{ 
                      inputProps: { min: 0, step: 1 }
                    }}
                    value={localAgeMin}
                    onChange={handleAgeMinChange}
                    placeholder="0"
                  />
                  <Typography variant="caption" color="textSecondary">
                    Whole numbers only
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max Age"
                    type="number"
                    size="small"
                    InputProps={{ 
                      inputProps: { min: 0, step: 1 }
                    }}
                    value={localAgeMax}
                    onChange={handleAgeMaxChange}
                    placeholder="20"
                  />
                  <Typography variant="caption" color="textSecondary">
                    Whole numbers only
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Location Filter */}
        <Grid item xs={12} md={4} sx={gridItemStyle}>
          <Accordion defaultExpanded disableGutters sx={accordionStyle}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="location-filter-content"
              id="location-filter-header"
              sx={accordionSummaryStyle}
            >
              <Typography>Location</Typography>
            </AccordionSummary>
            <AccordionDetails sx={accordionDetailsStyle}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Search by City, State, or ZIP Code
              </Typography>
              <LocationFilter 
                selectedLocations={localLocations}
                onLocationsChange={handleLocationChange}
                size="small"
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Sort By</Typography>
          <SortSelector 
            sortOrder={sortOrder} 
            onSortChange={onSortChange} 
            size="small" 
            sx={{ minWidth: '150px' }}
          />
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            onClick={handleResetFilters} 
            sx={{ 
              mr: 1, 
              textTransform: 'uppercase', 
              fontWeight: 500,
              borderColor: '#9e9e9e',
              color: '#616161'
            }}
            size="small"
          >
            Reset
          </Button>
          <Button 
            variant="contained" 
            onClick={handleApplyFilters}
            sx={{ 
              textTransform: 'uppercase', 
              fontWeight: 500,
              bgcolor: '#5e35b1', 
              '&:hover': {
                bgcolor: '#4a2a8a',
              }
            }}
            size="small"
          >
            Apply Filters
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default FilterPanel;