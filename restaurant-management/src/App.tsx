import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import { Layout } from './components/Layout/Layout';
import { Customers } from './pages/Customers';
import { Dashboard } from './pages/Dashboard';
import { Menu } from './pages/Menu';
import { Orders } from './pages/Orders';
import { Tables } from './pages/Tables';
import { socketService } from './services/socket';
import { store } from './store';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { fetchTables } from './store/features/tablesSlice';
import { fetchMenuItems } from './store/features/menuSlice';
import { fetchOrders } from './store/features/ordersSlice';
import { fetchCustomers } from './store/features/customersSlice';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f7fa',
    },
  },
});

// Create a separate component for the app content
const AppContent = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'tables' | 'menu' | 'orders' | 'customers'>('dashboard');
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    socketService.connect();
    dispatch(fetchTables());
    dispatch(fetchMenuItems());
    dispatch(fetchOrders());
    dispatch(fetchCustomers());
    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  return (
    <Layout activeView={activeView} onNavigate={(view) => setActiveView(view as typeof activeView)}>
      {activeView === 'dashboard' && <Dashboard />}
      {activeView === 'tables' && <Tables />}
      {activeView === 'menu' && <Menu />}
      {activeView === 'orders' && <Orders />}
      {activeView === 'customers' && <Customers />}
    </Layout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
