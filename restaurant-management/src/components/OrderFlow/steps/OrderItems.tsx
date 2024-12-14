import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { MenuItem, Table, Customer } from '../../../types';
import { Box, Grid, Paper, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface OrderItemTemp {
  menuItemId: number;
  quantity: number;
}

interface OrderItemsProps {
  table: Table;
  customer: Customer;
  items: OrderItemTemp[];
  setItems: (items: OrderItemTemp[]) => void;
}

const OrderItems: React.FC<OrderItemsProps> = ({ items, setItems }) => {
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const categories = [...new Set(menuItems.map(item => item.category))];

  const addItem = (menuItem: MenuItem) => {
    const existingItem = items.find(item => item.menuItemId === menuItem._id);
    
    if (existingItem) {
      setItems(items.map(item => 
        item.menuItemId === menuItem._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setItems([...items, { menuItemId: menuItem._id, quantity: 1 }]);
    }
  };

  const removeItem = (menuItemId: number) => {
    setItems(
      items.map(item => 
        item.menuItemId === menuItemId && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };


  return (
    <Box sx={{ display: 'flex', gap: 2, height: '70vh' }}>
      {/* Menu Section */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {categories.map(category => (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {category}
            </Typography>
            <Grid container spacing={2}>
              {menuItems
                .filter(item => item.category === category)
                .map(item => (
                  <Grid item xs={4} key={item._id}>
                    <Paper
                      sx={{
                        p: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${item.price}
                        </Typography>
                      </Box>
                      <IconButton
                        color="primary"
                        onClick={() => addItem(item)}
                        sx={{ alignSelf: 'flex-end' }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          </Box>
        ))}
      </Box>

      {/* Order Summary */}
      <Paper sx={{ width: 300, p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Order Summary
        </Typography>
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {items.map(item => (
            <Box key={item.menuItemId} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">
                  {menuItems.find(m => m._id === item.menuItemId)?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => removeItem(item.menuItemId)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => addItem(menuItems.find(m => m._id === item.menuItemId)!)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderItems; 