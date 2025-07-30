// src/guards/ChefGuard.jsx - ACTUALIZADO
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

  // ACCESO EXCLUSIVO: Solo cocineros pueden acceder a kitchen
  if (user.role !== 'cocinero') {
    // Si es administrador, redirigir a admin
    if (user.role === 'administrador') {
      return <Navigate to="/admin" replace />;
    }
    // Para otros roles, redirigir a home
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is chef
  return children;
};

export default ChefGuard;