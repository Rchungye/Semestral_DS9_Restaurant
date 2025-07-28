// src/pages/KitchenPage/kitchen-header.jsx
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import useUserStore from '../../store/userStore';

export function KitchenHeader({ onLogout }) {
  const { user, isLoading } = useUserStore();

  return (
    <Box component="header" sx={{
      backgroundColor: '#d32f2f',
      color: 'white',
      px: 4,
      py: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h6" component="div">
          🍽️
        </Typography>
        <Typography variant="h6" component="h1">
          Panel de Cocina
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        {user && (
          <Typography variant="body2">
            Bienvenido, {user.name} {user.lastName} ({user.role})
          </Typography>
        )}
        <Button
          color="inherit"
          onClick={onLogout}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
              Cerrando...
            </>
          ) : (
            "× Cerrar sesión"
          )}
        </Button>
      </Box>
    </Box>
  );
}