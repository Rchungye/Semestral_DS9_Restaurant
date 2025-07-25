import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  LinearProgress,
} from "@mui/material"

const drawerWidth = 280

const sidebarItems = [
  { text: "Resumen", icon: "■", active: true },
  { text: "Menú", icon: "☰" },
  { text: "Pedidos", icon: "◉" },
  { text: "Ventas", icon: "▲" },
  { text: "Mesas", icon: "□" },
  { text: "Promociones", icon: "◆" },
  { text: "Crear Cuentas", icon: "+" },
  { text: "Configuración", icon: "⚙" },
]

const weeklyData = [
  { name: "Lun", sales: 1200, percentage: 33 },
  { name: "Mar", sales: 1900, percentage: 53 },
  { name: "Mié", sales: 1100, percentage: 31 },
  { name: "Jue", sales: 2400, percentage: 67 },
  { name: "Vie", sales: 3100, percentage: 86 },
  { name: "Sáb", sales: 3600, percentage: 100 },
  { name: "Dom", sales: 3400, percentage: 94 },
]

const recentOrders = [
  {
    id: "GP-2024-001",
    customer: "Juan Pérez",
    type: "Para Llevar",
    total: "$37.58",
    status: "Completado",
    time: "hace 2 horas",
  },
  {
    id: "GP-2024-002",
    customer: "María García",
    type: "En Local",
    total: "$52.97",
    status: "En Proceso",
    time: "hace 30 min",
  },
  {
    id: "GP-2024-003",
    customer: "Carlos López",
    type: "Para Llevar",
    total: "$19.98",
    status: "Pendiente",
    time: "hace 15 min",
  },
]

const getStatusColor = (status) => {
  switch (status) {
    case "Completado":
      return "success"
    case "En Proceso":
      return "primary"
    case "Pendiente":
      return "warning"
    default:
      return "default"
  }
}

export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login"); // redirige al login
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold", color: "#ffa726"}}>
          🐼 Golden Panda
        </Typography>
      </Toolbar>
      <List sx={{ px: 2 }}>
        {sidebarItems.map((item, index) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              sx={{
                borderRadius: 2,
                backgroundColor: item.active ? "primary.main" : "transparent",
                color: item.active ? "white" : "text.primary",
                "&:hover": {
                  backgroundColor: item.active ? "primary.dark" : "action.hover",
                },
              }}
            >
              <Box sx={{ mr: 2, fontSize: "1.2rem" }}>{item.icon}</Box>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "white",
          color: "text.primary",
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            ☰
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Panel de Administración
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button color="inherit">⚙ Configuración</Button>
            <Button color="inherit" onClick={handleLogout}>× Cerrar Sesión</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {/* Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  $ Ingresos Totales
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                  $15,231
                </Typography>
                <Typography variant="body2" color="success.main">
                  +20.1% desde el mes pasado
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  • Pedidos
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                  624
                </Typography>
                <Typography variant="body2" color="success.main">
                  +15% desde el mes pasado
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  ◦ Clientes
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                  1,234
                </Typography>
                <Typography variant="body2" color="success.main">
                  +8% desde el mes pasado
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  ↗ Crecimiento
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                  +12.5%
                </Typography>
                <Typography variant="body2" color="success.main">
                  +2% desde el mes pasado
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ▬ Ventas Semanales
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {weeklyData.map((day) => (
                    <Box key={day.name} sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2">{day.name}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          ${day.sales}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={day.percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "#f5f5f5",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#f44336",
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ◐ Tipos de Pedidos
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body1">• En Local</Typography>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        65%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={65}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "#f5f5f5",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#f44336",
                        },
                      }}
                    />
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body1">◦ Para Llevar</Typography>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        35%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={35}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "#f5f5f5",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#ff9800",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Orders Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ▣ Pedidos Recientes
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Pedido</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Tiempo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.type}
                          size="small"
                          variant="outlined"
                          color={order.type === "En Local" ? "primary" : "secondary"}
                        />
                      </TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <Chip label={order.status} size="small" color={getStatusColor(order.status)} />
                      </TableCell>
                      <TableCell>{order.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
