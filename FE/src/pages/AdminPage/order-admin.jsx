"use client"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
} from "@mui/material"
import { fetchAllOrders, deleteOrder } from "../../services/orderService"

const statusOptions = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "preparando", label: "Preparando" },
  { value: "finalizado", label: "Finalizado" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
]

const typeOptions = [
  { value: "todos", label: "Todos" },
  { value: "local", label: "En Local" },
  { value: "takeout", label: "Para Llevar" },
]

const getStatusColor = (status) => {
  switch (status) {
    case "pendiente":
      return "warning"
    case "preparando":
      return "info"
    case "finalizado":
      return "success"
    case "entregado":
      return "success"
    case "cancelado":
      return "error"
    default:
      return "default"
  }
}

const getStatusText = (status) => {
  const statusMap = {
    pendiente: "Pendiente",
    preparando: "Preparando",
    finalizado: "Finalizado",
    entregado: "Entregado",
    cancelado: "Cancelado",
  }
  return statusMap[status] || status
}

const getTypeColor = (type) => {
  return type === "local" ? "primary" : "secondary"
}

const getTypeText = (type) => {
  return type === "local" ? "En Local" : "Para Llevar"
}

export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("todos")
  const [typeFilter, setTypeFilter] = useState("todos")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" })

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, statusFilter, typeFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await fetchAllOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      showAlert("Error al cargar los pedidos", "error")
      console.error("Error loading orders:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Filtrar por estado
    if (statusFilter !== "todos") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Filtrar por tipo
    if (typeFilter !== "todos") {
      filtered = filtered.filter((order) => order.type === typeFilter)
    }

    setFilteredOrders(filtered)
  }

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type })
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "success" })
    }, 4000)
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedOrder(null)
  }

  const handleDeleteOrder = async (order) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el pedido ${order.idIncremental}?`)) {
      try {
        await deleteOrder(order.idIncremental)
        showAlert("Pedido eliminado exitosamente")
        loadOrders()
      } catch (error) {
        console.error("Error deleting order:", error)
        showAlert("Error al eliminar el pedido", "error")
      }
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

  const formatOrderId = (order) => {
    return `GP-${order.idIncremental.toString().padStart(4, "0")}`
  }

  const getCustomerInfo = (order) => {
    if (order.type === "takeout") {
      return order.customerName || "Cliente Takeout"
    }
    return order.tableId ? `Mesa ${order.tableId.tableNumber}` : "Mesa N/A"
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const orderDate = new Date(dateString)
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} min`
    }
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`
    }
    const diffInDays = Math.floor(diffInHours / 24)
    return `hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando pedidos...</Typography>
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
          <Typography variant="h5" gutterBottom>
            ◉ Gestión de Pedidos
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Todos los Pedidos ({filteredOrders.length})
          </Typography>

          {/* Filtros */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filtrar por estado</InputLabel>
              <Select value={statusFilter} label="Filtrar por estado" onChange={(e) => setStatusFilter(e.target.value)}>
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filtrar por tipo</InputLabel>
              <Select value={typeFilter} label="Filtrar por tipo" onChange={(e) => setTypeFilter(e.target.value)}>
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID Pedido</TableCell>
                  <TableCell>Cliente/Mesa</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tiempo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.idIncremental}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatOrderId(order)}
                      </Typography>
                      {order.invoiceNumber && (
                        <Typography variant="caption" color="text.secondary">
                          {order.invoiceNumber}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{getCustomerInfo(order)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeText(order.type)}
                        size="small"
                        variant="outlined"
                        color={getTypeColor(order.type)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        ${order.total.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Subtotal: ${order.subtotal.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={getStatusText(order.status)} size="small" color={getStatusColor(order.status)} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{formatDate(order.orderDate)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {getTimeAgo(order.orderDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button size="small" sx={{ mr: 1 }} onClick={() => handleViewOrder(order)} title="Ver detalles">
                        👁
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDeleteOrder(order)} title="Eliminar">
                        ×
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredOrders.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                {orders.length === 0 ? "No hay pedidos registrados" : "No hay pedidos que coincidan con los filtros"}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog para ver detalles del pedido */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del Pedido {selectedOrder && formatOrderId(selectedOrder)}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Información General
                </Typography>
                <Typography variant="body2">
                  <strong>ID:</strong> {formatOrderId(selectedOrder)}
                </Typography>
                <Typography variant="body2">
                  <strong>Tipo:</strong> {getTypeText(selectedOrder.type)}
                </Typography>
                <Typography variant="body2">
                  <strong>Estado:</strong> {getStatusText(selectedOrder.status)}
                </Typography>
                <Typography variant="body2">
                  <strong>Fecha:</strong> {formatDate(selectedOrder.orderDate)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Cliente/Mesa
                </Typography>
                {selectedOrder.type === "takeout" ? (
                  <>
                    <Typography variant="body2">
                      <strong>Cliente:</strong> {selectedOrder.customerName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedOrder.customerEmail}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Factura:</strong> {selectedOrder.invoiceNumber}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2">
                    <strong>Mesa:</strong> {selectedOrder.tableId?.tableNumber || "N/A"}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Totales
                </Typography>
                <Typography variant="body2">
                  <strong>Subtotal:</strong> ${selectedOrder.subtotal.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  <strong>Total:</strong> ${selectedOrder.total.toFixed(2)}
                </Typography>
              </Grid>

              {selectedOrder.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Notas
                  </Typography>
                  <Typography variant="body2">{selectedOrder.notes}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
