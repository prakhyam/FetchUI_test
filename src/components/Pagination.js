import React from 'react';
import { Box, Button } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Pagination = ({ currentPage, onPageChange, hasNext, hasPrev }) => {
  return (
    <Box className="pagination-container">

      {/* Previous button */}
      <Button
        startIcon={<NavigateBeforeIcon />}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        variant="outlined"
        sx={{ mr: 2 }}
      >
        Previous
      </Button>
      
      {/* Next button */}
      <Button
        endIcon={<NavigateNextIcon />}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        variant="outlined"
      >
        Next
      </Button>
    </Box>
  );
};

export default Pagination;