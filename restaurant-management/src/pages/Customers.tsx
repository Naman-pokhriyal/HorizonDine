import { Search as SearchIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { addCustomerAsync, fetchCustomers, selectCustomers } from '../store/features/customersSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const Customers = () => {
  const dispatch = useAppDispatch();
  const { customers, status, error } = useAppSelector(selectCustomers);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    _id: Date.now(),
    fname: '',
    lname: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCustomers());
    }
  }, [status, dispatch]);

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      await dispatch(addCustomerAsync(formData)).unwrap();
      setOpenDialog(false);
      setFormData({
        _id: Date.now(),
        fname: '',
        lname: '',
        phone: '',
        email: '',
        notes: ''
      });
    } catch (err) {
      console.error('Failed to add customer:', err);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      _id: Date.now(),
      fname: '',
      lname: '',
      phone: '',
      email: '',
      notes: ''
    });
  };

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
          {error || 'Failed to load customers'}
        </Alert>
      </Box>
    );
  }

  return (
    <PageContainer title="Customers">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        gap: 2 
      }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            placeholder="Search customers..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          sx={{ height: 56 }}
        >
          Add New Customer
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id} hover>
                <TableCell>{customer.fname} {customer.lname}</TableCell>
                <TableCell>
                  <Box>
                    {customer.phone}
                    {customer.email && (
                      <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                        {customer.email}
                      </Box>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Add New Customer</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="First Name"
              value={formData.fname}
              onChange={handleChange('fname')}
              fullWidth
              required
            />
            <TextField
              label="Last Name"
              value={formData.lname}
              onChange={handleChange('lname')}
              fullWidth
            />
            <TextField
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange('phone')}
              fullWidth
              required
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={handleChange('email')}
              fullWidth
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={handleChange('notes')}
              multiline
              rows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.fname || !formData.phone}
          >
            Add Customer
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}; 