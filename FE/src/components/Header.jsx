// src/components/Header.jsx
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Si usas react-router

const Header = () => {
  return (
    <>
      {/* Barra de navegación superior */}
      <AppBar 
        position="static" 
        sx={{ 
          bgcolor: '#d32f2f',
          py: 1,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo/Nombre */}
          <Typography 
            variant="h4" 
            component={Link} 
            to="/" // Link a la página principal
            sx={{ 
              fontWeight: 'bold',
              color: 'black',
              fontFamily: '"Times New Roman", serif'
            }}
          >
            GOLDEN PANDA
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {['Inicio', 'Menu', 'Pedir Ya', 'Iniciar Sesion'].map((item) => (
              <Button
                key={item}
                component={Link}
                to={`/${item.toLowerCase()}`}
                sx={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Banner */}
      <Box 
        sx={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url()',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          py: { xs: 10, md: 15 },
          mb: 4
        }}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            textShadow: '2px 2px 8px #000'
          }}
        >
          NO SE QUE PONER AQUI BRO O LO BORRO
        </Typography>
      </Box>
    </>
  );
};

export default Header;