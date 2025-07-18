import { Box, Typography } from '@mui/material';

const AdsFood = () => {
  return (
    <Box
      sx={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url()',
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
  );
};

export default AdsFood;
