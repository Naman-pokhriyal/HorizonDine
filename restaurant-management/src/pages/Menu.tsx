import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { useEffect } from 'react';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { fetchMenuItems, selectFilteredItems, selectMenu, setCategory } from '../store/features/menuSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const Menu = () => {
  const dispatch = useAppDispatch();
  const { status, error, selectedCategory } = useAppSelector(selectMenu);
  const items = useAppSelector(selectFilteredItems);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMenuItems());
    }
  }, [status, dispatch]);

  const handleCategoryChange = (newValue: string) => {
    dispatch(setCategory(newValue as MenuState['selectedCategory']));
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
          {error || 'Failed to load menu items'}
        </Alert>
      </Box>
    );
  }

  return (
    <PageContainer title="Menu">
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => handleCategoryChange(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minWidth: 120,
              py: 2,
            }
          }}
        >
          <Tab label="All Items" value="all" />
          <Tab label="Appetizers" value="appetizer" />
          <Tab label="Main Course" value="main" />
          <Tab label="Desserts" value="dessert" />
          <Tab label="Beverages" value="Drinks" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={item._id}>
            <Card 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                height: '450px',
                width: '100%',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              <CardMedia
                component="img"
                height="240"
                image={import.meta.env.VITE_SOCKET_URL+item.image}
                alt={item.name}
                sx={{ 
                  objectFit: 'cover',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <CardContent 
                sx={{ 
                  flexGrow: 1, 
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Box>
                  <Typography 
                    variant="h6" 
                    noWrap 
                    sx={{ 
                      mb: 1,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography 
                    variant="h5"
                    color="primary.main"
                    sx={{ fontWeight: 'bold' }}
                  >
                    ${item.price.toFixed(2)}
                  </Typography>
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5,
                    minHeight: '4.5em',
                  }}
                >
                  {item.description}
                </Typography>

                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                  <Chip 
                    label={item.category} 
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
}; 