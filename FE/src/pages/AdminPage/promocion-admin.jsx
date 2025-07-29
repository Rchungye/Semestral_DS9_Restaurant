"use client"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
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
  Grid,
  Checkbox,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import { fetchAllPromotions, createPromotion, updatePromotion, deletePromotion } from "../../services/promotionService"

const discountTypeOptions = [
  { value: "porcentaje", label: "Porcentaje (%)" },
  { value: "monto_fijo", label: "Monto Fijo ($)" },
]

const categoryOptions = [
  { value: "entrada", label: "Entrada" },
  { value: "plato_principal", label: "Plato Principal" },
  { value: "bebida", label: "Bebida" },
  { value: "acompañamiento", label: "Acompañamiento" },
]

const dayOptions = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
]

const getStatusColor = (promotion) => {
  const now = new Date()
  const validFrom = new Date(promotion.validFrom)
  const validTo = new Date(promotion.validTo)

  if (!promotion.isActive) return "error"
  if (now < validFrom) return "warning"
  if (now > validTo) return "default"
  return "success"
}

const getStatusText = (promotion) => {
  const now = new Date()
  const validFrom = new Date(promotion.validFrom)
  const validTo = new Date(promotion.validTo)

  if (!promotion.isActive) return "Inactiva"
  if (now < validFrom) return "Programada"
  if (now > validTo) return "Expirada"
  return "Activa"
}

export default function PromotionsManagement() {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discountType: "",
    discountValue: "",
    applicableToCategories: [],
    validFrom: "",
    validTo: "",
    validDays: [],
    isActive: true,
  })
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadPromotions()
  }, [])

  const loadPromotions = async () => {
    try {
      setLoading(true)
      const data = await fetchAllPromotions()
      setPromotions(data)
    } catch (error) {
      showAlert("Error al cargar las promociones", "error")
      console.error("Error loading promotions:", error)
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

  const handleOpenDialog = (promotion = null) => {
    if (promotion) {
      setEditingPromotion(promotion)
      setFormData({
        name: promotion.name,
        description: promotion.description || "",
        discountType: promotion.discountType,
        discountValue: promotion.discountValue.toString(),
        applicableToCategories: promotion.applicableToCategories || [],
        validFrom: new Date(promotion.validFrom).toISOString().slice(0, 16),
        validTo: new Date(promotion.validTo).toISOString().slice(0, 16),
        validDays: promotion.validDays || [],
        isActive: promotion.isActive,
      })
    } else {
      setEditingPromotion(null)
      setFormData({
        name: "",
        description: "",
        discountType: "",
        discountValue: "",
        applicableToCategories: [],
        validFrom: "",
        validTo: "",
        validDays: [],
        isActive: true,
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingPromotion(null)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      applicableToCategories: prev.applicableToCategories.includes(category)
        ? prev.applicableToCategories.filter((c) => c !== category)
        : [...prev.applicableToCategories, category],
    }))
  }

  const handleDayChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      validDays: prev.validDays.includes(day) ? prev.validDays.filter((d) => d !== day) : [...prev.validDays, day],
    }))
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      // Validaciones básicas
      if (
        !formData.name.trim() ||
        !formData.discountType ||
        !formData.discountValue ||
        !formData.validFrom ||
        !formData.validTo
      ) {
        showAlert("Por favor completa todos los campos requeridos", "error")
        return
      }

      const promotionData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: Number.parseFloat(formData.discountValue),
        applicableToCategories: formData.applicableToCategories,
        validFrom: new Date(formData.validFrom).toISOString(),
        validTo: new Date(formData.validTo).toISOString(),
        validDays: formData.validDays,
        isActive: formData.isActive,
      }

      if (editingPromotion) {
        await updatePromotion(editingPromotion.idIncremental, promotionData)
        showAlert("Promoción actualizada exitosamente")
      } else {
        await createPromotion(promotionData)
        showAlert("Promoción creada exitosamente")
      }

      handleCloseDialog()
      loadPromotions()
    } catch (error) {
      console.error("Error saving promotion:", error)
      showAlert("Error al guardar la promoción", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (promotion) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${promotion.name}"?`)) {
      try {
        await deletePromotion(promotion.idIncremental)
        showAlert("Promoción eliminada exitosamente")
        loadPromotions()
      } catch (error) {
        console.error("Error deleting promotion:", error)
        showAlert("Error al eliminar la promoción", "error")
      }
    }
  }

  const toggleActive = async (promotion) => {
    try {
      await updatePromotion(promotion.idIncremental, {
        ...promotion,
        isActive: !promotion.isActive,
      })
      showAlert(`Promoción ${!promotion.isActive ? "activada" : "desactivada"} exitosamente`)
      loadPromotions()
    } catch (error) {
      console.error("Error updating promotion:", error)
      showAlert("Error al actualizar la promoción", "error")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDiscount = (promotion) => {
    if (promotion.discountType === "porcentaje") {
      return `${promotion.discountValue}%`
    }
    return `$${promotion.discountValue.toFixed(2)}`
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando promociones...</Typography>
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
              ◆ Promociones y Descuentos
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
              + Crear Promoción
            </Button>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Promociones ({promotions.length})
          </Typography>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descuento</TableCell>
                  <TableCell>Vigencia</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {promotions.map((promotion) => (
                  <TableRow key={promotion.idIncremental}>
                    <TableCell>{promotion.idIncremental}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {promotion.name}
                        </Typography>
                        {promotion.description && (
                          <Typography variant="caption" color="text.secondary">
                            {promotion.description.substring(0, 50)}
                            {promotion.description.length > 50 ? "..." : ""}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{formatDiscount(promotion)}</TableCell>
                    <TableCell>
                      <Typography variant="caption" display="block">
                        Desde: {formatDate(promotion.validFrom)}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Hasta: {formatDate(promotion.validTo)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={getStatusText(promotion)} size="small" color={getStatusColor(promotion)} />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => toggleActive(promotion)}
                        title={promotion.isActive ? "Desactivar" : "Activar"}
                      >
                        {promotion.isActive ? "◉" : "○"}
                      </Button>
                      <Button size="small" sx={{ mr: 1 }} onClick={() => handleOpenDialog(promotion)} title="Editar">
                        ✎
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDelete(promotion)} title="Eliminar">
                        ×
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {promotions.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                No hay promociones registradas. ¡Crea la primera promoción!
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog para agregar/editar promociones */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingPromotion ? "Editar Promoción" : "Crear Nueva Promoción"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de la Promoción *"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Descuento *</InputLabel>
                <Select
                  value={formData.discountType}
                  label="Tipo de Descuento *"
                  onChange={(e) => handleInputChange("discountType", e.target.value)}
                >
                  {discountTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label={`Valor del Descuento *${formData.discountType === "porcentaje" ? " (%)" : " ($)"}`}
                type="number"
                value={formData.discountValue}
                onChange={(e) => handleInputChange("discountValue", e.target.value)}
                inputProps={{
                  min: 0,
                  max: formData.discountType === "porcentaje" ? 100 : undefined,
                  step: formData.discountType === "porcentaje" ? 1 : 0.01,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fecha de Inicio *"
                type="datetime-local"
                value={formData.validFrom}
                onChange={(e) => handleInputChange("validFrom", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fecha de Fin *"
                type="datetime-local"
                value={formData.validTo}
                onChange={(e) => handleInputChange("validTo", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Categorías Aplicables (dejar vacío para aplicar a todas):
              </Typography>
              <FormGroup row>
                {categoryOptions.map((category) => (
                  <FormControlLabel
                    key={category.value}
                    control={
                      <Checkbox
                        checked={formData.applicableToCategories.includes(category.value)}
                        onChange={() => handleCategoryChange(category.value)}
                      />
                    }
                    label={category.label}
                  />
                ))}
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Días de la Semana (dejar vacío para todos los días):
              </Typography>
              <FormGroup row>
                {dayOptions.map((day) => (
                  <FormControlLabel
                    key={day.value}
                    control={
                      <Checkbox
                        checked={formData.validDays.includes(day.value)}
                        onChange={() => handleDayChange(day.value)}
                      />
                    }
                    label={day.label}
                  />
                ))}
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                  />
                }
                label="Promoción Activa"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                {editingPromotion ? "Actualizando..." : "Creando..."}
              </>
            ) : editingPromotion ? (
              "Actualizar Promoción"
            ) : (
              "Crear Promoción"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
