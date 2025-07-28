// src/guards/ChefGuard.jsx
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import useUserStore from '../store/userStore';
import { useEffect } from 'react';

const ChefGuard = ({ children }) => {
  const { isAuthenticated, user, isLoading, getProfile } = useUserStore();

  // Initialize auth check if we have a token but no user data
  useEffect(() => {
    const token = useUserStore.getState().token;
    if (token && !user && !isLoading) {
      getProfile();
    }
  }, [user, getProfile, isLoading]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has chef or admin role (both can access kitchen)
  if (!['cocinero', 'administrador'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has appropriate role
  return children;
};

export default ChefGuard;