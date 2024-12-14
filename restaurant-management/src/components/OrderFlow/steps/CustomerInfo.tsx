import React, { useState } from 'react';
import { Customer } from '../../../types';
import { Box, TextField, Stack, Typography, Paper, Autocomplete, Button, Grid, List, ListItem, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { customersApi } from '../../../services/api';
import { useDispatch } from 'react-redux';
import { addCustomer } from '../../../store/features/customersSlice';

interface CustomerInfoProps {
  onSelect: (customer: Customer) => void;
  selectedCustomer: Customer | null;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ onSelect, selectedCustomer }) => {
  const dispatch = useDispatch();
  const customers = useSelector((state: RootState) => state.customers.customers);
  const [formData, setFormData] = React.useState({
    name: selectedCustomer? selectedCustomer.fname+" "+selectedCustomer.lname : '',
    phone: selectedCustomer?.phone || '',
    notes: selectedCustomer?.notes || ''
  });
  const [newCustomer, setNewCustomer] = useState({ 
    fname: '', 
    lname: '', 
    phone: '', 
    email: '', 
    notes: '' 
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormData = {
      ...formData,
      [field]: event.target.value
    };
    setFormData(newFormData);

    if (newFormData.name && newFormData.phone) {
      handleSubmit(newFormData);
    }
  };

  const handleSubmit = (data: typeof formData) => {
    onSelect({
      _id: selectedCustomer?._id || Date.now(),
      fname: data.name.split(' ')[0],
      lname: data.name.split(' ')[1],
      phone: data.phone,
      notes: data.notes
    });
  };

  const handleAddCustomer = async () => {
    try {
      const createdCustomer = await customersApi.add(newCustomer);
      dispatch(addCustomer(createdCustomer));
      onSelect(createdCustomer);
      setNewCustomer({ fname: '', lname: '', phone: '', email: '', notes: '' }); // Reset form
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  return (
    <Grid container spacing={2}>
      {/* Existing customers list on the left */}
      <Grid item xs={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Select Existing Customer
          </Typography>
          <Autocomplete
            options={customers}
            value={selectedCustomer}
            getOptionLabel={(customer) => `${customer.fname} ${customer.lname} (${customer.phone})`}
            onChange={(_, customer) => customer && onSelect(customer)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Customers"
                fullWidth
                margin="normal"
              />
            )}
            renderOption={(props, customer) => (
              <ListItem {...props}>
                <ListItemText
                  primary={`${customer.fname} ${customer.lname}`}
                  secondary={`Phone: ${customer.phone}${customer.email ? ` • Email: ${customer.email}` : ''}`}
                />
              </ListItem>
            )}
            isOptionEqualToValue={(option, value) => option._id === value?._id}
          />
        </Paper>
      </Grid>

      {/* New customer form on the right */}
      <Grid item xs={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add New Customer
          </Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="First Name"
              value={newCustomer.fname}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, fname: e.target.value }))}
            />
            <TextField
              label="Last Name"
              value={newCustomer.lname}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, lname: e.target.value }))}
            />
            <TextField
              label="Phone"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
            />
            <TextField
              label="Email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
            />
            <TextField
              label="Notes"
              value={newCustomer.notes}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
              multiline
              rows={2}
            />
            <Button 
              variant="contained" 
              onClick={handleAddCustomer}
              disabled={!newCustomer.fname || !newCustomer.lname || !newCustomer.phone}
            >
              Add New Customer
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CustomerInfo; 