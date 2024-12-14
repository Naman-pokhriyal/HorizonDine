import {
  Add as AddIcon,
  People as CustomersIcon,
  Dashboard as DashboardIcon,
  Restaurant as MenuIcon,
  Receipt as OrdersIcon,
  TableRestaurant as TableIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { OrderFlowDialog } from '../OrderFlow/OrderFlowDialog';

const DRAWER_WIDTH = 240;

const MENU_ITEMS = [
  { text: 'Dashboard', value: 'dashboard', icon: <DashboardIcon /> },
  { text: 'Tables', value: 'tables', icon: <TableIcon /> },
  { text: 'Menu', value: 'menu', icon: <MenuIcon /> },
  { text: 'Orders', value: 'orders', icon: <OrdersIcon /> },
  { text: 'Customers', value: 'customers', icon: <CustomersIcon /> },
] as const;

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Layout = ({ children, activeView, onNavigate }: LayoutProps) => {
  const [orderFlowOpen, setOrderFlowOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Restaurant Manager
          </Typography>
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => setOrderFlowOpen(true)}
          >
            New Order
          </Button>
        </Box>

        <List>
          {MENU_ITEMS.map(({ text, value, icon }) => (
            <ListItemButton
              key={value}
              selected={activeView === value}
              onClick={() => onNavigate(value)}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box 
        component="main" 
        sx={{ p:3, flex:1 }}
      >
        {children}
      </Box>

      <OrderFlowDialog 
        open={orderFlowOpen}
        onClose={() => setOrderFlowOpen(false)}
      />
    </Box>
  );
}; 