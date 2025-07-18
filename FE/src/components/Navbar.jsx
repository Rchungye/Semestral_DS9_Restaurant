import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {

  const getRoutePath = (item) => {
    switch (item.toLowerCase()) {
      case 'inicio':
        return '/';
      case 'pedir ya':
        return '/pedir-ya';
      case 'area staff':
        return '/iniciar-sesion';
      default:
        return '/';
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'black',
        py: 1,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h4"
          component={Link}
          to="/"
          sx={{
            fontWeight: 'bold',
            fontFamily: '"Times New Roman", serif',
            textDecoration: 'none',
          }}
        >
          GOLDEN PANDA
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {['Inicio', 'Pedir Ya', 'Area Staff'].map((item) => (
            <Button
              key={item}
              component={Link}
              to={getRoutePath(item)}
              sx={{
                color: 'white',
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
  );
};

export default Navbar;