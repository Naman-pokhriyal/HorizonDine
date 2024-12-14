import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Select, 
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import { Order } from '../types';
import { useDispatch } from 'react-redux';
import { updateOrder, deleteOrder } from '../store/features/ordersSlice';
import { ordersApi } from '../services/api';
import { useState } from 'react';

interface OrderDetailsDialogProps {
  order: Order | null;
  onClose: () => void;
  menuItems: any[];
}

export const OrderDetailsDialog = ({ order, onClose, menuItems }: OrderDetailsDialogProps) => {
  const dispatch = useDispatch();
  const [currentOrder, setCurrentOrder] = useState(order);

  if (!currentOrder) return null;

  const handleStatusChange = async (newStatus: Order['status']) => {
    try {
      const updatedOrder = await ordersApi.update(currentOrder._id, { ...currentOrder, status: newStatus });
      dispatch(updateOrder(updatedOrder));
      setCurrentOrder(updatedOrder);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await ordersApi.delete(currentOrder._id);
        dispatch(deleteOrder(currentOrder._id));
        onClose();
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  const total = currentOrder.itemIDs.reduce((sum, item) => {
    const menuItem = menuItems.find(mi => mi._id === item.itemID);
    return sum + ((menuItem?.price || 0) * item.quantity);
  }, 0);

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box>
          <Typography variant="h6">
            Order #{currentOrder._id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Table {currentOrder.tableId} • {new Date(currentOrder.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={currentOrder.status}
                label="Status"
                onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
              >
                <MenuItem value="Placed">Placed</MenuItem>
                <MenuItem value="Preparing">Preparing</MenuItem>
                <MenuItem value="Ready">Ready</MenuItem>
                <MenuItem value="Payment">Payment</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Order Items</Typography>
            {currentOrder.itemIDs.map((item, idx) => {
              const menuItem = menuItems.find(mi => mi._id === item.itemID);
              return (
                <Box key={idx} sx={{ mb: 1 }}>
                  <Typography>
                    {item.quantity}x {menuItem?.name} - ${((menuItem?.price || 0) * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              );
            })}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">
              Total: ${total.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} color="error">
          Delete Order
        </Button>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 