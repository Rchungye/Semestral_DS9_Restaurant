// src/components/Header.jsx
import { Box, Typography } from '@mui/material';
import Navbar from './Navbar';

const Header = () => {
  return (
    <>
      <Navbar />

      <Box
        sx={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url()', // Aquí pon la imagen
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          py: { xs: 10, md: 15 },
          mb: 4,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            textShadow: '2px 2px 8px #000',
          }}
        >
          NO SE QUE PONER AQUI BRO O LO BORRO
        </Typography>
      </Box>
    </>
  );
};

export default Header;
