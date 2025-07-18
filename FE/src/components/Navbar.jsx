import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: '#d32f2f',
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
            color: 'black',
            fontFamily: '"Times New Roman", serif',
            textDecoration: 'none',
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
  );
};

export default Navbar;
