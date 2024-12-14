import { Box, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { selectCustomers } from '../store/features/customersSlice';
import { selectOrders } from '../store/features/ordersSlice';
import { selectTables } from '../store/features/tablesSlice';
import { useAppSelector } from '../store/hooks';
import { selectMenu } from '../store/features/menuSlice';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const Dashboard = () => {
  const { orders, status: orderStatus } = useAppSelector(selectOrders);
  const { tables } = useAppSelector(selectTables);
  const { customers } = useAppSelector(selectCustomers);
  const { items: menuItems } = useAppSelector(selectMenu);

  // Calculate statistics
  const totalRevenue = orders?.reduce((sum, order) => 
    sum + (order.itemIDs?.reduce((itemSum, item) => {
      const menuItem = menuItems.find(mi => mi._id === item.itemID);
      return itemSum + ((menuItem?.price || 0) * item.quantity);
    }, 0) || 0)
  , 0) || 0;

  const todayOrders = orders.filter(order => 
    new Date(order.createdAt).toDateString() === new Date().toDateString()
  );

  const tableStatusData = {
    labels: ['Available', 'Occupied', 'Reserved', 'Cleaning'],
    datasets: [{
      data: [
        tables.filter(t => t.status === 'AVAILABLE').length,
        tables.filter(t => t.status === 'OCCUPIED').length,
        tables.filter(t => t.status === 'RESERVED').length,
        tables.filter(t => t.status === 'CLEANING').length,
      ],
      backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ff9800'],
    }]
  };

  const orderStatusData = {
    labels: ['Placed', 'Preparing', 'Ready', 'Payment', 'Done'],
    datasets: [{
      label: 'Orders by Status',
      data: [
        orders.filter(o => o.status === 'Placed').length,
        orders.filter(o => o.status === 'Preparing').length,
        orders.filter(o => o.status === 'Ready').length,
        orders.filter(o => o.status === 'Payment').length,
        orders.filter(o => o.status === 'Done').length,
      ],
      backgroundColor: ['#ffd54f', '#4fc3f7', '#81c784', '#e0e0e0', '#ff9800'],
    }]
  };

  const popularItems = orders?.reduce((acc, order) => {
    order.itemIDs?.forEach(item => {
      const menuItem = menuItems.find(mi => mi._id === item.itemID);
      if (menuItem) {
        acc[menuItem.name] = (acc[menuItem.name] || 0) + item.quantity;
      }
    });
    return acc;
  }, {} as Record<string, number>) || {};

  const popularItemsData = {
    labels: Object.keys(popularItems).slice(0, 5),
    datasets: [{
      label: 'Most Popular Items',
      data: Object.values(popularItems).slice(0, 5),
      backgroundColor: '#1976d2',
    }]
  };

  if (orderStatus === 'loading') {
    return <CircularProgress />;
  }

  return (
    <PageContainer title="Dashboard">
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">Total Revenue</Typography>
            <Typography variant="h4">${totalRevenue.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">Today's Orders</Typography>
            <Typography variant="h4">{todayOrders.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">Active Tables</Typography>
            <Typography variant="h4">{tables.filter(t => t.status === 'OCCUPIED').length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">Total Customers</Typography>
            <Typography variant="h4">{customers.length}</Typography>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Table Status</Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut 
                data={tableStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Order Status</Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={orderStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Popular Items</Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={popularItemsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
}; 