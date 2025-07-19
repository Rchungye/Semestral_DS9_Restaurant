import {
  Container,
  Typography,
  Grid,
  Box,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Fade,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import { 
  Search, 
  FilterList, 
  Star, 
  LocalFireDepartment,
  Nature,
  Schedule
} from "@mui/icons-material";
import { useState, useMemo } from "react";
import CardFood from "../components/CardFood";
import Navbar from "../components/Navbar";
import AdsFood from "../components/AdsFood";

// Productos expandidos con más datos
const productos = [
  {
    nombre: "Siu mai",
    descripcion: "4 piezas · Puerco y Camarón - Tradicional dim sum cantonés con textura jugosa",
    precio: 4,
    imagen: "https://images.squarespace-cdn.com/content/v1/51f7fb1ee4b03d20c9b4c34b/1376340296181-YWXEZXB9NTE9JQQ6BBPB/shu-mai.jpg",
    categoria: "dim-sum",
    etiquetas: ["popular", "tradicional"],
    tiempo: "15 min",
    rating: 4.8,
  },
  {
    nombre: "Hakao",
    descripcion: "4 piezas · Empanaditas de Camarón - Delicados dumplings translúcidos",
    precio: 5.50,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpyE0H-gVsbYZ7uy0Z31Z3uUkMeemgTPAweg&s",
    categoria: "dim-sum",
    etiquetas: ["premium", "especial"],
    tiempo: "12 min",
    rating: 4.9,
  },
  {
    nombre: "Chee Cheong Fun",
    descripcion: "3 rollos · Rollos de Arroz con Puerco - Suaves láminas de arroz rellenas",
    precio: 4.50,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN-s-9FjeDBAXslrP4g4tqFmCu5ZaEm3TA5Q&s",
    categoria: "dim-sum",
    etiquetas: ["veggie-friendly", "ligero"],
    tiempo: "10 min",
    rating: 4.6,
  },
  {
    nombre: "Wonton Frito",
    descripcion: "6 piezas · Crujientes wontons rellenos de camarón y cerdo",
    precio: 6.25,
    imagen: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop",
    categoria: "fritos",
    etiquetas: ["crujiente", "popular"],
    tiempo: "8 min",
    rating: 4.7,
  },
  {
    nombre: "Rollitos Primavera con Carne",
    descripcion: "4 piezas · Vegetales frescos envueltos, opción vegetariana",
    precio: 3.75,
    imagen: "https://content-cocina.lecturas.com/medio/2022/03/03/rollitos-de-primavera-con-carne-y-salsa-de-soja_00000000_240402112349_1200x1200.jpg",
    categoria: "dim-sum",
    etiquetas: ["saludable", "eco"],
    tiempo: "5 min",
    rating: 4.4,
  },
  {
    nombre: "Pato Laqueado",
    descripcion: "Porción individual · Pato glaseado con salsa hoisin y cebollín",
    precio: 12.99,
    imagen: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop",
    categoria: "premium",
    etiquetas: ["premium", "especial"],
    tiempo: "25 min",
    rating: 4.9,
  }
];

const categorias = [
  { id: "todos", label: "Todos", icon: "🍽️" },
  { id: "dim-sum", label: "Dim Sum", icon: "🥟" },
  { id: "fritos", label: "Fritos", icon: "🍤" },
  { id: "vegetariano", label: "Vegetariano", icon: "🥬" },
  { id: "premium", label: "Premium", icon: "⭐" },
];

const etiquetasColores = {
  popular: { color: "#ff5722", icon: <LocalFireDepartment fontSize="small" /> },
  premium: { color: "#9c27b0", icon: <Star fontSize="small" /> },
  veggie: { color: "#4caf50", icon: <Nature fontSize="small" /> },
  "veggie-friendly": { color: "#4caf50", icon: <Nature fontSize="small" /> },
  eco: { color: "#4caf50", icon: <Nature fontSize="small" /> },
  tradicional: { color: "#795548", icon: null },
  especial: { color: "#e91e63", icon: <Star fontSize="small" /> },
  crujiente: { color: "#ff9800", icon: null },
  ligero: { color: "#2196f3", icon: null },
  saludable: { color: "#4caf50", icon: <Nature fontSize="small" /> },
};

const Home = () => {
  const theme = useTheme();
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Filtrar productos
  const productosFiltrados = useMemo(() => {
    let resultado = productos;

    // Filtro por categoría
    if (categoriaActiva !== "todos") {
      resultado = resultado.filter(p => p.categoria === categoriaActiva);
    }

    // Filtro por búsqueda
    if (busqueda.trim()) {
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.etiquetas.some(etiqueta => etiqueta.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }

    return resultado;
  }, [categoriaActiva, busqueda]);

  const handleCategoriaChange = (event, nuevaCategoria) => {
    setCategoriaActiva(nuevaCategoria);
  };

  return (
    <>
      <Navbar />
      <AdsFood />
      
      {/* Hero Section con estadísticas */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          py: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Auténtica Cocina Asiática
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 3, lineHeight: 1.4 }}
              >
                Descubre sabores tradicionales preparados con ingredientes frescos y técnicas milenarias
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      4.8
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rating
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      backgroundColor: alpha(theme.palette.warning.main, 0.1),
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      15
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Min
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      50+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Platos
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header del menú con búsqueda */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.5rem" },
                color: "text.primary",
              }}
            >
              Nuestro Menú
            </Typography>
            
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Filtros
            </Button>
          </Box>

          {/* Búsqueda */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar platos, ingredientes..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
              },
            }}
          />

          {/* Tabs de categorías */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={categoriaActiva}
              onChange={handleCategoriaChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  minHeight: 48,
                },
              }}
            >
              {categorias.map((categoria) => (
                <Tab
                  key={categoria.id}
                  value={categoria.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{categoria.icon}</span>
                      {categoria.label}
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>

          {/* Filtros adicionales */}
          <Fade in={mostrarFiltros}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                Etiquetas populares:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(etiquetasColores).map(([etiqueta, config]) => (
                  <Chip
                    key={etiqueta}
                    label={etiqueta}
                    icon={config.icon}
                    onClick={() => setBusqueda(etiqueta)}
                    sx={{
                      backgroundColor: alpha(config.color, 0.1),
                      color: config.color,
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: alpha(config.color, 0.2),
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Fade>
        </Box>

        {/* Productos */}
        <Fade in={true} timeout={600}>
          <Box>
            {productosFiltrados.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  backgroundColor: alpha(theme.palette.grey[100], 0.5),
                  borderRadius: 3,
                }}
              >
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  No encontramos platos que coincidan
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Intenta con una búsqueda diferente o explora otras categorías
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setBusqueda("");
                    setCategoriaActiva("todos");
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Ver todos los platos
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {productosFiltrados.map((producto, index) => (
                  <Grid item key={producto.nombre} xs={12} sm={6} lg={4}>
                    <Fade in={true} timeout={800 + index * 200}>
                      <Box sx={{ height: '100%' }}>
                        <CardFood
                          {...producto}
                          categoria={categorias.find(c => c.id === producto.categoria)?.label}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>

        {/* Call to Action */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10)`,
            textAlign: 'center',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            ¿No encuentras lo que buscas?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            Tenemos más de 50 platos tradicionales. Explora nuestro menú completo o contáctanos para recomendaciones personalizadas.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Ver menú completo
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Contactar chef
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Home;