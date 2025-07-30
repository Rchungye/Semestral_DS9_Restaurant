"use client"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { getAllUsers, createUserAdmin, updateUserAdmin, deleteUserAdmin } from "../../services/userService"
import { Edit, Delete } from "@mui/icons-material"

const roleOptions = [
  { value: "administrador", label: "Administrador", color: "primary" },
  { value: "cocinero", label: "Cocinero", color: "secondary" },
]

const getStatusColor = (user) => {
  // Por ahora todos los usuarios están activos, pero podríamos agregar lógica aquí
  return "success"
}

const getStatusText = (user) => {
  // Por ahora todos los usuarios están activos
  return "Activo"
}

const getRoleConfig = (role) => {
  const config = roleOptions.find((r) => r.value === role)
  return config || { label: role, color: "default" }
}

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    username: "",
    password: "",
    role: "",
  })
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" })
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await getAllUsers()

      // Verificar si la respuesta es exitosa
      if (response && !response.error) {
        setUsers(Array.isArray(response) ? response : [])
      } else {
        console.error("Error response:", response)
        showAlert("Error al cargar los usuarios", "error")
        setUsers([])
      }
    } catch (error) {
      showAlert("Error al cargar los usuarios", "error")
      console.error("Error loading users:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type })
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "success" })
    }, 4000)
  }

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        lastName: user.lastName,
        username: user.username,
        password: "", // No mostrar password existente
        role: user.role,
      })
    } else {
      setEditingUser(null)
      setFormData({
        name: "",
        lastName: "",
        username: "",
        password: "",
        role: "",
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUser(null)
    setShowPassword(false)
    setFormData({
      name: "",
      lastName: "",
      username: "",
      password: "",
      role: "",
    })
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      // Validaciones básicas
      if (!formData.name.trim() || !formData.lastName.trim() || !formData.username.trim() || !formData.role) {
        showAlert("Por favor completa todos los campos requeridos", "error")
        return
      }

      // Validar password solo para nuevos usuarios o si se está cambiando
      if (!editingUser && !formData.password.trim()) {
        showAlert("La contraseña es requerida para nuevos usuarios", "error")
        return
      }

      const userData = {
        name: formData.name.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        role: formData.role,
      }

      // Solo incluir password si se proporciona
      if (formData.password.trim()) {
        userData.password = formData.password.trim()
      }

      let response
      if (editingUser) {
        // Actualizar usuario existente
        response = await updateUserAdmin(editingUser.idIncremental, userData)
      } else {
        // Crear nuevo usuario
        response = await createUserAdmin(userData)
      }

      // Verificar si la respuesta es exitosa
      if (response && !response.error) {
        showAlert(editingUser ? "Usuario actualizado exitosamente" : "Usuario creado exitosamente")
        handleCloseDialog()
        loadUsers() // Recargar la lista
      } else {
        // Manejar errores específicos del backend
        if (response?.error?.includes("already exists") || response?.error?.includes("Username already exists")) {
          showAlert("El nombre de usuario ya existe", "error")
        } else if (response?.error?.includes("required fields")) {
          showAlert("Datos inválidos. Verifica todos los campos", "error")
        } else {
          showAlert(response?.error || "Error al guardar el usuario", "error")
        }
      }
    } catch (error) {
      console.error("Error saving user:", error)
      showAlert("Error al guardar el usuario", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (user) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.name} ${user.lastName}"?`)) {
      try {
        const response = await deleteUserAdmin(user.idIncremental)

        if (response && !response.error) {
          showAlert("Usuario eliminado exitosamente")
          loadUsers() // Recargar la lista
        } else {
          showAlert(response?.error || "Error al eliminar el usuario", "error")
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        showAlert("Error al eliminar el usuario", "error")
      }
    }
  }

  const formatUserName = (user) => {
    return `${user.name} ${user.lastName}`
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando usuarios...</Typography>
      </Box>
    )
  }

  return (
    <>
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              + Gestión de Usuarios
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
              + Agregar Usuario
            </Button>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Usuarios del Sistema ({users.length})
          </Typography>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre Completo</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha Creación</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.idIncremental}>
                    <TableCell>{user.idIncremental}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {formatUserName(user)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {user.username}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleConfig(user.role).label}
                        size="small"
                        variant="outlined"
                        color={getRoleConfig(user.role).color}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={getStatusText(user)} size="small" color={getStatusColor(user)} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric", month: "short", day: "numeric",
                          })
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary" sx={{ mr: 1 }}
                        onClick={() => handleOpenDialog(user)} title="Editar">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error"
                        onClick={() => handleDelete(user)} title="Eliminar" >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {users.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">No hay usuarios registrados. ¡Crea el primer usuario!</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog para agregar/editar usuarios */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nombre *"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Apellido *"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de Usuario *"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                helperText="Será usado para iniciar sesión"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={editingUser ? "Nueva Contraseña (opcional)" : "Contraseña *"}
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                helperText={
                  editingUser ? "Deja vacío para mantener la contraseña actual" : "Mínimo 6 caracteres recomendado"
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rol *</InputLabel>
                <Select value={formData.role} label="Rol *" onChange={(e) => handleInputChange("role", e.target.value)}>
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                {editingUser ? "Actualizando..." : "Creando..."}
              </>
            ) : editingUser ? (
              "Actualizar Usuario"
            ) : (
              "Crear Usuario"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
