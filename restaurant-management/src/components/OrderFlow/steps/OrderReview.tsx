import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { Table, Customer } from '../../../types';
import { RootState } from '../../../store';

interface OrderReviewProps {
  table: Table;
  customer: Customer;
  items: { menuItemId: number; quantity: number; }[];
}

const OrderReview: React.FC<OrderReviewProps> = ({ table, customer, items }) => {
  const menuItems = useSelector((state: RootState) => state.menu.items);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Table Information</Typography>
            <Typography>Table Number: {table.no}</Typography>
            <Typography>Status: {table.status}</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Customer Information</Typography>
            <Typography>Name: {customer.fname} {customer.lname}</Typography>
            <Typography>Phone: {customer.phone}</Typography>
            {customer.notes && (
              <Typography>Special Requests: {customer.notes}</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Order Items</Typography>
            {items.map((item) => {
              const menuItem = menuItems.find(m => m._id === item.menuItemId);
              if (!menuItem) return null;

              return (
                <Box key={item.menuItemId} sx={{ mb: 1 }}>
                  <Typography>
                    {item.quantity}x {menuItem.name} - ${menuItem.price * item.quantity}
                  </Typography>
                </Box>
              );
            })}
            
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: ${items.reduce((total, item) => {
                const menuItem = menuItems.find(m => m._id === item.menuItemId);
                return total + (menuItem?.price || 0) * item.quantity;
              }, 0).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderReview; 