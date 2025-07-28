"use client"

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
} from "@mui/material"
import { Search, FilterList, Star, LocalFireDepartment, Nature } from "@mui/icons-material"
import { useState, useMemo, useEffect } from "react"
import { fetchDishes } from "../services/dishService"
import CardFood from "../components/CardFood"
import Navbar from "../components/Navbar"
import AdsFood from "../components/AdsFood"

// Categorías que coinciden con el backend
const categorias = [
  { id: "todos", label: "Todos", icon: "🍽️" },
  { id: "entrada", label: "Entradas", icon: "🥟" },
  { id: "plato_principal", label: "Platos Principales", icon: "🍜" },
  { id: "bebida", label: "Bebidas", icon: "🥤" },
  { id: "acompañamiento", label: "Acompañamientos", icon: "🍚" },
]

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
}

const Home = () => {
  const theme = useTheme()
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [categoriaActiva, setCategoriaActiva] = useState("todos")
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  useEffect(() => {
    fetchDishes() // Solo platos con availability: true
      .then((data) => {
        console.log("Dishes loaded:", data)
        setDishes(data)
      })
      .catch((error) => {
        console.error("Error loading dishes:", error)
        setDishes([])
      })
      .finally(() => setLoading(false))
  }, [])

  // Filtrar platos
  const dishesFiltrados = useMemo(() => {
    let resultado = dishes

    // Filtro por categoría
    if (categoriaActiva !== "todos") {
      resultado = resultado.filter((dish) => dish.category === categoriaActiva)
    }

    // Filtro por búsqueda
    if (busqueda.trim()) {
      resultado = resultado.filter(
        (dish) =>
          dish.name.toLowerCase().includes(busqueda.toLowerCase()) ||
          (dish.description && dish.description.toLowerCase().includes(busqueda.toLowerCase())),
      )
    }

    return resultado
  }, [dishes, categoriaActiva, busqueda])

  const handleCategoriaChange = (event, nuevaCategoria) => {
    setCategoriaActiva(nuevaCategoria)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              Cargando menú...
            </Typography>
          </Box>
        </Container>
      </>
    )
  }

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
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Auténtica Cocina Asiática
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 3, lineHeight: 1.4 }}>
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
                      {dishes.length}+
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
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
              },
            }}
          />

          {/* Tabs de categorías */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={categoriaActiva}
              onChange={handleCategoriaChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  minHeight: 48,
                },
              }}
            >
              {categorias.map((categoria) => (
                <Tab
                  key={categoria.id}
                  value={categoria.id}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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
                      "&:hover": {
                        backgroundColor: alpha(config.color, 0.2),
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Fade>
        </Box>

        {/* Platos */}
        <Fade in={true} timeout={600}>
          <Box>
            {dishesFiltrados.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: "center",
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
                    setBusqueda("")
                    setCategoriaActiva("todos")
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Ver todos los platos
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {dishesFiltrados.map((dish, index) => (
                  <Grid item key={dish.idIncremental || dish._id} xs={12} sm={6} lg={4}>
                    <Fade in={true} timeout={800 + index * 200}>
                      <Box sx={{ height: "100%" }}>
                        <CardFood
                          name={dish.name}
                          description={dish.description}
                          price={dish.price}
                          photo={dish.photo}
                          category={categorias.find((c) => c.id === dish.category)?.label}
                          hasPromotion={dish.hasPromotion}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>
      </Container>
    </>
  )
}

export default Home
