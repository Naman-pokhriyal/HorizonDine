import { useEffect } from 'react';
import { Grid, Paper, Box, Typography, Select, MenuItem } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectTables, updateTableStatus, fetchTables } from '../store/features/tablesSlice';
import { Table } from '../types';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { socketService } from '../services/socket';
import { Alert, CircularProgress } from '@mui/material';

export const Tables = () => {
  const dispatch = useAppDispatch();
  const { tables, status, error } = useAppSelector(selectTables);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTables());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'Failed to load tables'}
        </Alert>
      </Box>
    );
  }

  const handleStatusChange = (tableId: number, newStatus: Table['status']) => {
    dispatch(updateTableStatus({ tableId, status: newStatus }));
    socketService.emitTableStatusUpdate(tableId, newStatus);
  };

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'AVAILABLE': return '#4caf50';
      case 'OCCUPIED': return '#f44336';
      case 'RESERVED': return '#2196f3';
      case 'CLEANING': return '#2196f3';
    }
  };

  const getStatusBgColor = (status: Table['status']) => {
    switch (status) {
      case 'AVAILABLE': return '#e8f5e9';
      case 'OCCUPIED': return '#ffebee';
      case 'RESERVED': return '#e3f2fd';
      case 'CLEANING': return '#e3f2fd';
    }
  };

  return (
    <PageContainer title="Tables">
      <Grid container spacing={4}>
        {tables.map(table => (
          <Grid item xs={12} md={12} lg={6} key={table._id}>
            <Paper
              elevation={2}
              sx={{
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                minHeight: '220px',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box
                sx={{
                  height: '8px',
                  bgcolor: getStatusColor(table.status),
                  transition: 'background-color 0.3s ease',
                }}
              />

              <Box sx={{ p: 4 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 4
                }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Table {table.no}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {table.capacity} capacity
                    </Typography>
                  </Box>

                  <Box sx={{ width: '40%' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Current Status
                    </Typography>
                    <Select
                      fullWidth
                      value={table.status}
                      onChange={(e) => handleStatusChange(table._id, e.target.value as Table['status'])}
                      size="small"
                      sx={{
                        height: '48px',
                        bgcolor: getStatusBgColor(table.status),
                        '& .MuiSelect-select': {
                          fontWeight: 500,
                          fontSize: '1.1rem',
                          color: getStatusColor(table.status),
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: getStatusColor(table.status),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: getStatusColor(table.status),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: getStatusColor(table.status),
                        },
                      }}
                    >
                      <MenuItem value="AVAILABLE">Available</MenuItem>
                      <MenuItem value="OCCUPIED">Occupied</MenuItem>
                      <MenuItem value="RESERVED">Reserved</MenuItem>
                      <MenuItem value="CLEANING">Cleaning</MenuItem>
                    </Select>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
}; 