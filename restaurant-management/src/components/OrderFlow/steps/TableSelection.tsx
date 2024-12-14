import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Table } from '../../../types';
import { Box, Grid, Paper, Typography } from '@mui/material';

interface TableSelectionProps {
  selectedTable: Table | null;
  onSelect: (table: Table) => void;
}

const TableSelection: React.FC<TableSelectionProps> = ({ selectedTable, onSelect }) => {
  const tables = useSelector((state: RootState) => state.tables.tables);

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'AVAILABLE': return 'success.light';
      case 'OCCUPIED': return 'error.light';
      case 'RESERVED': return 'warning.light';
      case 'CLEANING': return 'info.light';
      default: return 'grey.light';
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {tables.map((table) => (
          <Grid item xs={3} key={table._id}>
            <Paper
              elevation={2}
              onClick={() => onSelect(table)}
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                border: selectedTable?._id === table._id ? '2px solid' : 'none',
                borderColor: 'primary.main',
                bgcolor: getStatusColor(table.status),
                '&:hover': {
                  bgcolor: getStatusColor(table.status),
                }
              }}
            >
              <Typography variant="h4" sx={{ mb: 1 }}>
                {table.no}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {table.status}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TableSelection; 