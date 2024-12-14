import { Box, Typography, Divider } from '@mui/material';
import { ReactNode } from 'react';

interface PageContainerProps {
  title: string;
  children: ReactNode;
}

export const PageContainer = ({ title, children }: PageContainerProps) => (
  <Box>
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 1 , flex:1}}>
        {title}
      </Typography>
      <Divider />
    </Box>
    {children}
  </Box>
); 