import { Box, Typography, Button } from '@mui/material';

export function KitchenHeader({ onLogout }) {
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

      <Button color="inherit" onClick={onLogout}>
        × Cerrar sesión
      </Button>
    </Box>
  );
}
