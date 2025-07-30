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
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
} from "@mui/material"
import { fetchAllDishes, createDish, updateDish, deleteDish } from "../../services/dishService"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars,
  faPlus,
  faToggleOn,
  faToggleOff,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"

const categoryOptions = [
  { value: "entrada", label: "Entrada" },
  { value: "plato_principal", label: "Plato Principal" },
  { value: "bebida", label: "Bebida" },
  { value: "acompañamiento", label: "Acompañamiento" },
]

const getStatusColor = (availability) => {
  return availability ? "success" : "error"
}

const getStatusText = (availability) => {
  return availability ? "Disponible" : "No Disponible"
}

export default function MenuAdmin() {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingDish, setEditingDish] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    photo: "",
    category: "",
    availability: true,
  })
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" })
  const [submitting, setSubmitting] = useState(false)

  // Cargar platos al montar el componente
  useEffect(() => {
    loadDishes()
  }, [])

  const loadDishes = async () => {
    try {
      setLoading(true)
      const data = await fetchAllDishes()
      setDishes(data)
    } catch (error) {
      showAlert("Error al cargar los platos", "error")
      console.error("Error loading dishes:", error)
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

  const handleOpenDialog = (dish = null) => {
    if (dish) {
      setEditingDish(dish)
      setFormData({
        name: dish.name,
        price: dish.price.toString(),
        description: dish.description || "",
        photo: dish.photo || "",
        category: dish.category,
        availability: dish.availability,
      })
    } else {
      setEditingDish(null)
      setFormData({
        name: "",
        price: "",
        description: "",
        photo: "",
        category: "",
        availability: true,
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingDish(null)
    setFormData({
      name: "",
      price: "",
      description: "",
      photo: "",
      category: "",
      availability: true,
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
      if (!formData.name.trim() || !formData.price || !formData.category) {
        showAlert("Por favor completa todos los campos requeridos", "error")
        return
      }

      const dishData = {
        name: formData.name.trim(),
        price: Number.parseFloat(formData.price),
        description: formData.description.trim(),
        photo: formData.photo.trim(),
        category: formData.category,
        availability: formData.availability,
      }

      if (editingDish) {
        // Actualizar plato existente
        await updateDish(editingDish.idIncremental, dishData)
        showAlert("Plato actualizado exitosamente")
      } else {
        // Crear nuevo plato
        await createDish(dishData)
        showAlert("Plato creado exitosamente")
      }

      handleCloseDialog()
      loadDishes() // Recargar la lista
    } catch (error) {
      console.error("Error saving dish:", error)
      showAlert("Error al guardar el plato", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (dish) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${dish.name}"?`)) {
      try {
        await deleteDish(dish.idIncremental)
        showAlert("Plato eliminado exitosamente")
        loadDishes() // Recargar la lista
      } catch (error) {
        console.error("Error deleting dish:", error)
        showAlert("Error al eliminar el plato", "error")
      }
    }
  }

  const toggleAvailability = async (dish) => {
    try {
      await updateDish(dish.idIncremental, {
        ...dish,
        availability: !dish.availability,
      })
      showAlert(`Plato ${!dish.availability ? "activado" : "desactivado"} exitosamente`)
      loadDishes()
    } catch (error) {
      console.error("Error updating availability:", error)
      showAlert("Error al actualizar la disponibilidad", "error")
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando menú...</Typography>
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
              <FontAwesomeIcon icon={faBars} style={{ marginRight: 8 }} />
              Gestión de Menú
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: 6 }} />
              Agregar Plato
            </Button>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Items del Menú ({dishes.length})
          </Typography>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dishes.map((dish) => (
                  <TableRow key={dish.idIncremental}>
                    <TableCell>{dish.idIncremental}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {dish.name}
                        </Typography>
                        {dish.description && (
                          <Typography variant="caption" color="text.secondary">
                            {dish.description.substring(0, 50)}
                            {dish.description.length > 50 ? "..." : ""}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {categoryOptions.find((cat) => cat.value === dish.category)?.label || dish.category}
                    </TableCell>
                    <TableCell>${dish.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip label={getStatusText(dish.availability)} size="small" color={getStatusColor(dish.availability)} />
                    </TableCell>
                    <TableCell>
                      <Button size="small" sx={{ mr: 1 }} onClick={() => toggleAvailability(dish)}
                        title={dish.availability ? "Desactivar" : "Activar"} >
                        <FontAwesomeIcon icon={dish.availability ? faToggleOn : faToggleOff} />
                      </Button>
                      <Button size="small" sx={{ mr: 1 }} onClick={() => handleOpenDialog(dish)} title="Editar">
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDelete(dish)} title="Eliminar">
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {dishes.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">No hay platos registrados. ¡Agrega el primer plato!</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog para agregar/editar platos */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDish ? "Editar Plato" : "Agregar Nuevo Plato"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre del Plato *"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Categoría *</InputLabel>
            <Select
              value={formData.category}
              label="Categoría *"
              onChange={(e) => handleInputChange("category", e.target.value)}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Precio *"
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            sx={{ mb: 2 }}
            inputProps={{ min: 0, step: 0.01 }}
          />

          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="URL de la Imagen"
            value={formData.photo}
            onChange={(e) => handleInputChange("photo", e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.availability}
                onChange={(e) => handleInputChange("availability", e.target.checked)}
              />
            }
            label="Disponible para pedidos"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                {editingDish ? "Actualizando..." : "Creando..."}
              </>
            ) : editingDish ? (
              "Actualizar Plato"
            ) : (
              "Crear Plato"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
