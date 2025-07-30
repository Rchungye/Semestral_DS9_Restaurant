"use client"

import { Container, Typography, Grid, Box, Chip, Button, IconButton, TextField, InputAdornment, Drawer, Tabs, Tab, Fade, Paper, useTheme, alpha } from "@mui/material"
import { Search, FilterList, Star, Add, Remove, Delete } from "@mui/icons-material"
import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import { fetchDishesWithPromotions } from "../services/dishService" // ← CAMBIO AQUÍ
import CardFood from "../components/CardFood"
import Navbar from "../components/Navbar"
import AdsFood from "../components/AdsFood"

const categorias = [
  { id: "todos", label: "Todos", icon: "🍽️" },
  { id: "entrada", label: "Entradas", icon: "🥟" },
  { id: "plato_principal", label: "Platos Principales", icon: "🍜" },
  { id: "bebida", label: "Bebidas", icon: "🥤" },
  { id: "acompañamiento", label: "Acompañamientos", icon: "🍚" },
]

const etiquetasColores = {
  premium: { color: "#9c27b0", icon: <Star fontSize="small" /> },
  tradicional: { color: "#795548", icon: null },
  crujiente: { color: "#ff9800", icon: null },
}

const Home = () => {
  const theme = useTheme()
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [categoriaActiva, setCategoriaActiva] = useState("todos")
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [orderType, setOrderType] = useState("local");
  const [tableNumber, setTableNumber] = useState("")
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [cartNote, setCartNote] = useState("")
  const [searchParams] = useSearchParams()

  useEffect(() => {
  const mesa = searchParams.get("mesa");
  if (mesa) {
    setOrderType("local");
    setTableNumber(mesa);
  }
}, [searchParams]);

  const handleAddToCart = (dish) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.name === dish.name)
      if (idx !== -1) {
        const updated = [...prev]
        updated[idx].quantity += 1
        return updated
      }
      // Usar precio promocional si existe, sino precio normal
      const finalPrice = dish.hasPromotion && dish.promotionPrice ? dish.promotionPrice : dish.price
      return [...prev, { ...dish, price: finalPrice, quantity: 1 }]
    })
  }

  const handleQuantityChange = (idx, delta) => {
    setCartItems((prev) => {
      const updated = [...prev]
      updated[idx].quantity = Math.max(1, updated[idx].quantity + delta)
      return updated
    })
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleRemoveFromCart = (idx) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

  const handleCheckout = async () => {
    console.log("Checkout clickeado")
    // 1. Crear el pedido en /api/orders
    const orderPayload = {
      subtotal: total,
      total: total,
      notes: cartNote, 
      cartItems, 
      type: orderType,
      tableNumber: orderType === "local" && tableNumber ? tableNumber : undefined,
    };
    console.log(orderPayload);
    const orderRes = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    if (!orderRes.ok) {
      alert('Error al crear el pedido');
      return;
    }
    const orderData = await orderRes.json();
    // Guardar el orderId en localStorage para usarlo en /success
    localStorage.setItem('lastOrderId', orderData._id);
    // 2. Continuar con Stripe solo si el pedido se creó correctamente
    const stripe = await stripePromise;
    const response = await fetch('http://localhost:3000/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems, note: cartNote, orderId: orderData._id }),
    });
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Error al iniciar el pago');
    }
  }

  useEffect(() => {
    fetchDishesWithPromotions() // ← CAMBIO AQUÍ: usar la nueva función
      .then((data) => {
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
      <Navbar onCartClick={() => setCartOpen(true)} cartCount={cartItems.length} />
        <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
          <Box sx={{ width: 350, p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Tu carrito
            </Typography>
            {cartItems.length === 0 ? (
              <Typography color="text.secondary">El carrito está vacío.</Typography>
            ) : (
              <>
                {cartItems.map((item, idx) => (
                  <Box key={idx} sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.price} x {item.quantity}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton size="small" onClick={() => handleQuantityChange(idx, -1)} disabled={item.quantity === 1}>
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton size="small" onClick={() => handleQuantityChange(idx, 1)}>
                        <Add fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleRemoveFromCart(idx)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
                <Box sx={{ my: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total: ${total.toFixed(2)}
                  </Typography>
                </Box>
                {/* Selección de tipo de pedido */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    ¿Cómo comerás?
                  </Typography>
                  <Button
                    variant={orderType === "local" ? "contained" : "outlined"}
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => setOrderType("local")}
                  >
                    Local
                  </Button>
                  <Button
                    variant={orderType === "takeout" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setOrderType("takeout")}
                  >
                    Retiro
                  </Button>
                </Box>
                {/* Si es local, pedir número de mesa */}
                {orderType === "local" && (
                  <TextField
                    label="Número de mesa (opcional)"
                    type="number"
                    value={tableNumber}
                    onChange={e => setTableNumber(e.target.value)}
                    sx={{ mb: 2 }}
                    fullWidth
                  />
                )}
                <TextField
                  label="Anotaciones"
                  multiline
                  minRows={2}
                  fullWidth
                  value={cartNote}
                  onChange={e => setCartNote(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 1 }}
                  disabled={cartItems.length === 0}
                  onClick={handleCheckout}
                >
                  Ir a pagar
                </Button>
              </>
            )}
          </Box>
        </Drawer>
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
                      20
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

      <Container id="menu" maxWidth="lg" sx={{ py: 6, mt: 5, scrollMarginTop: { xs: "90px", md: "110px" } }}>
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
                          promotionPrice={dish.promotionPrice} // ← NUEVO PROP
                          promotionDetails={dish.promotionDetails} // ← NUEVO PROP
                          onAddToCart={() => handleAddToCart(dish)}
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
