"use client"

import { useNavigate } from "react-router-dom"
import { useState } from "react"
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
  Button,
  CircularProgress,
} from "@mui/material"
import useUserStore from "../../store/userStore"

// Importar todos los componentes (sin ConfiAdmin)
import DashboardResumen from "./dashboard-resumen"
import MenuAdmin from "./menu-admin"
import OrderAdmin from "./order-admin"
import PromocionAdmin from "./promocion-admin"
import MesaAdmin from "./mesa-admin"
import UsuariosAdmin from "./usuario-admin"
import VentasAdmin from "./ventas-admin"

const drawerWidth = 280

// Lista actualizada sin la opción de configuración
const sidebarItems = [
  { text: "Resumen", icon: "■", key: "dashboard" },
  { text: "Menú", icon: "☰", key: "menu" },
  { text: "Pedidos", icon: "◉", key: "orders" },
  { text: "Ventas", icon: "▲", key: "sales" },
  { text: "Mesas", icon: "□", key: "tables" },
  { text: "Promociones", icon: "◆", key: "promotions" },
  { text: "Crear Cuentas", icon: "+", key: "users" },
]

export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const navigate = useNavigate()
  const { user, logout, isLoading } = useUserStore()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      navigate("/login")
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardResumen />
      case "menu":
        return <MenuAdmin />
      case "orders":
        return <OrderAdmin />
      case "sales":
        return <VentasAdmin />
      case "tables":
        return <MesaAdmin />
      case "promotions":
        return <PromocionAdmin />
      case "users":
        return <UsuariosAdmin />
      default:
        return <DashboardResumen />
    }
  }

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold", color: "#ffa726" }}>
          🐼 Golden Panda
        </Typography>
      </Toolbar>
      <List sx={{ px: 2 }}>
        {sidebarItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleSectionChange(item.key)}
              sx={{
                borderRadius: 2,
                backgroundColor: activeSection === item.key ? "primary.main" : "transparent",
                color: activeSection === item.key ? "white" : "text.primary",
                "&:hover": {
                  backgroundColor: activeSection === item.key ? "primary.dark" : "action.hover",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user && (
              <Typography variant="body2" sx={{ mr: 2 }}>
                Bienvenido, {user.name} {user.lastName}
              </Typography>
            )}
            <Button color="inherit" onClick={handleLogout} disabled={isLoading}>
              {isLoading ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  Cerrando...
                </>
              ) : (
                "× Cerrar Sesión"
              )}
            </Button>
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
        {renderContent()}
      </Box>
    </Box>
  )
}
