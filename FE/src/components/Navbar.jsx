import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge, useTheme, alpha } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Navbar = ({ onCartClick, cartCount = 0 }) => {
  
  const getRoutePath = (item) => {
    switch (item.toLowerCase()) {
      case 'inicio':
        return '/';
      case 'area staff':
        return '/login';
      default:
        return '/';
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%)',
          borderBottom: '3px solid #d32f2f',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-3px',
            left: '0',
            right: '0',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #ffa726, transparent)',
          }
        }}
      >
        <Toolbar 
          sx={{ 
            justifyContent: 'space-between',
            py: 1.5,
            px: { xs: 2, md: 4 }
          }}
        >
          {/* Logo mejorado */}
          <Box 
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: 1.5,
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}
          >
            <Typography>
              🐼 
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontFamily: '"Playfair Display", "Times New Roman", serif',
                background: 'linear-gradient(45deg, #ffa726, #ffcc02)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '1px',
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
            Golden Panda
            </Typography>
          </Box>

          {/* Navigation mejorada */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {['Inicio','Area Staff'].map((item) => (
              <Button
                key={item}
                component={Link}
                to={getRoutePath(item)}
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #ffa726, #ffcc02)',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)',
                  },
                  '&:hover': {
                    color: '#ffa726',
                    backgroundColor: alpha('#ffa726', 0.1),
                    transform: 'translateY(-2px)',
                    '&::before': {
                      width: '100%',
                    }
                  },
                }}
              >
                {item}
              </Button>
            ))}
            
            {/* Cart icon con badge */}
            <IconButton
              sx={{
                ml: 2,
                color: 'white',
                bgcolor: alpha('#ffa726', 0.1),
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: alpha('#ffa726', 0.2),
                  borderColor: '#ffa726',
                  transform: 'scale(1.1)',
                }
              }}
              onClick={onCartClick}
            >
              <Badge 
                badgeContent={cartCount} 
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }
                }}
              >
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ py: 1.5, px: { xs: 2, md: 4 } }} />
    </>
  );
};

export default Navbar;