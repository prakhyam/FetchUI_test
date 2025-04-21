import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';

const SortSelector = ({ sortOrder, onSortChange }) => {
  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel id="sort-selector-label">Sort By</InputLabel>
      <Select
        labelId="sort-selector-label"
        id="sort-selector"
        value={sortOrder}
        label="Sort By"
        onChange={(e) => onSortChange(e.target.value)}
      >
        <MenuItem value="breed:asc">Breed (A-Z)</MenuItem>
        <MenuItem value="breed:desc">Breed (Z-A)</MenuItem>
        <MenuItem value="name:asc">Name (A-Z)</MenuItem>
        <MenuItem value="name:desc">Name (Z-A)</MenuItem>
        <MenuItem value="age:asc">Age (Youngest First)</MenuItem>
        <MenuItem value="age:desc">Age (Oldest First)</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortSelector;