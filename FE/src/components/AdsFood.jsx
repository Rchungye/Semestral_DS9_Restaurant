import { Box, Typography, Button, Container, IconButton, useTheme } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useState, useEffect } from 'react';

const AdsFood = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Datos de ejemplo para los slides
  const slides = [
    {
      id: 1,
      title: "¡Nuevos Sabores Asiáticos!",
      subtitle: "Descubre nuestra nueva línea de comida oriental",
      description: "Sushi fresco, ramen auténtico y más delicias asiáticas",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=1200&h=600&fit=crop",
      cta: "Explorar Menú",
      color: "#e91e63"
    },
    {
      id: 2,
      title: "HAY QUE CAMBIAR ESTO PORQUE NO OFRECEMOS DELIVERY",
      subtitle: "-----------------------------------------",
      description: "Recibe tu comida favorita sin costo de envío",
      image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200&h=600&fit=crop",
      cta: "Pedir ya",
      color: "#4caf50"
    }
  ];

  // Auto-slide cada 10 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '70vh', md: '80vh' },
        mb: 4,
        overflow: 'hidden',
      }}
    >
      {/* Background con imagen y overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(135deg, ${currentSlideData.color}CC, rgba(0,0,0,0.7)), url(${currentSlideData.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Particles/decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${currentSlideData.color}40 0%, transparent 50%), 
                       radial-gradient(circle at 80% 20%, ${currentSlideData.color}30 0%, transparent 50%)`,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
            '100%': { transform: 'translateY(0px)' },
          },
        }}
      />

      {/* Contenido principal */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Box
          sx={{
            textAlign: { xs: 'center', md: 'left' },
            maxWidth: { xs: '100%', md: '60%' },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              fontSize: { xs: '1rem', md: '1.2rem' },
              mb: 1,
              opacity: 0.9,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {currentSlideData.subtitle}
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
              mb: 2,
              textShadow: '4px 4px 20px rgba(0,0,0,0.5)',
              background: `linear-gradient(135deg, white 0%, ${currentSlideData.color}40 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 0.9,
            }}
          >
            {currentSlideData.title}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              mb: 4,
              opacity: 0.9,
              fontWeight: 300,
              lineHeight: 1.4,
            }}
          >
            {currentSlideData.description}
          </Typography>

          <Button
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 50,
              backgroundColor: currentSlideData.color,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: `0 8px 30px ${currentSlideData.color}50`,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: currentSlideData.color,
                transform: 'translateY(-3px)',
                boxShadow: `0 12px 40px ${currentSlideData.color}60`,
              },
            }}
          >
            {currentSlideData.cta}
          </Button>
        </Box>
      </Container>

      {/* Controles de navegación */}
      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: { xs: 16, md: 32 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          backgroundColor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.2)',
            transform: 'translateY(-50%) scale(1.1)',
          },
        }}
      >
        <ArrowBackIos />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: { xs: 16, md: 32 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          backgroundColor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.2)',
            transform: 'translateY(-50%) scale(1.1)',
          },
        }}
      >
        <ArrowForwardIos />
      </IconButton>

      {/* Indicadores de dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          gap: 1,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: currentSlide === index ? 32 : 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.8)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AdsFood;