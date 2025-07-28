// src/guards/AdminGuard.jsx
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import useUserStore from '../store/userStore';
import { useEffect } from 'react';

const AdminGuard = ({ children }) => {
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

  // Redirect to appropriate page if not admin
  if (user.role !== 'administrador') {
    if (user.role === 'cocinero') {
      return <Navigate to="/kitchen" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is admin
  return children;
};

export default AdminGuard;