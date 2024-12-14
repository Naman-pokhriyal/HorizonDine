import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { PageContainer } from '../components/PageContainer/PageContainer';
import {
  fetchOrders,
  selectFilteredOrders,
  selectOrders
} from '../store/features/ordersSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Order } from '../types';
import { selectMenu } from '../store/features/menuSlice';
import { OrderDetailsDialog } from '../components/OrderDetailsDialog';

export const Orders = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(selectOrders);
  const orders = useAppSelector(selectFilteredOrders);
  const [tabValue, setTabValue] = useState(0);
  const { items: menuItems } = useAppSelector(selectMenu);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrders());
    }
  }, [status, dispatch]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Placed': return 'warning';
      case 'Preparing': return 'info';
      case 'Ready': return 'success';
      case 'Payment': return 'warning';
      case 'Done': return 'success';
      default: return 'default';
    }
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
          {error || 'Failed to load orders'}
        </Alert>
      </Box>
    );
  }

  return (
    <PageContainer title="Orders">
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab label="Active Orders" />
          <Tab label="Completed" />
          <Tab label="All Orders" />
        </Tabs>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Table</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <TableRow 
                key={order._id} 
                hover 
                onClick={() => setSelectedOrder(order)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>#{order._id}</TableCell>
                <TableCell>Table {order.tableId}</TableCell>
                <TableCell>
                  {order.itemIDs?.map((item, idx) => {
                    const menuItem = menuItems?.find(mi => mi._id === item.itemID);
                    
                    return (
                      <Box key={idx} sx={{ mb: 0.5 }}>
                        <Typography variant="body2">
                          {item.quantity}x {menuItem?.name}
                        </Typography>
                      </Box>
                    );
                  })}
                </TableCell>
                <TableCell>
                  ${order.itemIDs?.reduce((sum, item) => {
                    const menuItem = menuItems?.find(mi => mi._id === item.itemID);
                    return sum + ((menuItem?.price || 0) * item.quantity);
                  }, 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            )) || []}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          menuItems={menuItems}
        />
      )}
    </PageContainer>
  );
}; 