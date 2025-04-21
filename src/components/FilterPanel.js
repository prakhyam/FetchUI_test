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
  TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SortSelector from './SortSelector';

const ITEM_HEIGHT = 48;
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
  onApplyFilters
}) => {
  const [localBreeds, setLocalBreeds] = useState(selectedBreeds);
  const [localAgeMin, setLocalAgeMin] = useState(ageMin);
  const [localAgeMax, setLocalAgeMax] = useState(ageMax);

  const handleBreedChange = (event) => {
    const {
      target: { value },
    } = event;
    setLocalBreeds(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleApplyFilters = () => {
    // Update parent component state
    onBreedsChange(localBreeds);
    onAgeChange(localAgeMin, localAgeMax);
    
    // Pass local state directly to onApplyFilters
    onApplyFilters(localBreeds, localAgeMin, localAgeMax);
  };

  const handleResetFilters = () => {
    setLocalBreeds([]);
    setLocalAgeMin('');
    setLocalAgeMax('');
    onBreedsChange([]);
    onAgeChange('', '');
    onApplyFilters([], '', '');
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Search Filters
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="breed-filter-content"
              id="breed-filter-header"
            >
              <Typography>Breed</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth>
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
        
        <Grid item xs={12} md={6}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="age-filter-content"
              id="age-filter-header"
            >
              <Typography>Age</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Min Age"
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    value={localAgeMin}
                    onChange={(e) => setLocalAgeMin(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max Age"
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    value={localAgeMax}
                    onChange={(e) => setLocalAgeMax(e.target.value)}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <SortSelector sortOrder={sortOrder} onSortChange={onSortChange} />
        
        <Box>
          <Button 
            variant="outlined" 
            onClick={handleResetFilters}
            sx={{ mr: 1 }}
          >
            Reset
          </Button>
          <Button 
            variant="contained" 
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default FilterPanel;