import type React from 'react';
import { Skeleton, Box, Grid } from '@mui/material';

const Loading: React.FC = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Skeleton variant="rectangular" width="100%" height={118} />
      <Box sx={{ pt: 0.5 }}>
        <Skeleton />
        <Skeleton width="60%" />
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} sm={4} key={item}>
            <Skeleton variant="rectangular" height={118} />
            <Box sx={{ pt: 0.5 }}>
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Loading;