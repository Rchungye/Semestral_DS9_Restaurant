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
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { getAllTables, createTable, deleteTable } from "../../services/tableService"
import SimpleTableQRCode from "../../components/SimpleTableQRCode"
import CreateTableDialog from "../../components/CreateTableDialog"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTable, faPlus, faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons"

export default function TableManagement() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedTable, setSelectedTable] = useState(null)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tableToDelete, setTableToDelete] = useState(null)

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      setLoading(true)
      setError("")
      const tablesData = await getAllTables()
      setTables(tablesData)
    } catch (err) {
      setError("Error al cargar las mesas")
      console.error("Error fetching tables:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTable = async (tableData) => {
    try {
      await createTable(tableData)
      await fetchTables()
    } catch (error) {
      throw error
    }
  }

  const handleDeleteTable = async () => {
    if (!tableToDelete) return

    try {
      await deleteTable(tableToDelete.idIncremental)
      await fetchTables()
      setDeleteDialogOpen(false)
      setTableToDelete(null)
    } catch (error) {
      setError("Error al eliminar la mesa")
    }
  }

  const handleShowQR = (table) => {
    setSelectedTable(table)
    setQrDialogOpen(true)
  }

  const getStatusColor = () => "success"
  const getStatusText = () => "Disponible"

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Cargando mesas...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              <FontAwesomeIcon icon={faTable} style={{ marginRight: 8 }} />
              Gestión de Mesas
            </Typography>
            <Button variant="contained" color="primary" onClick={() => setCreateDialogOpen(true)}>
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: 6 }} />
              Agregar Mesa
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Mesas del Restaurante ({tables.length})
          </Typography>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número de Mesa</TableCell>
                  <TableCell>Capacidad</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Código QR</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table._id}>
                    <TableCell>Mesa {table.tableNumber}</TableCell>
                    <TableCell>{table.capacity} personas</TableCell>
                    <TableCell>
                      <Chip label={getStatusText()} size="small" color={getStatusColor()} />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => handleShowQR(table)}>
                        Ver QR
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button size="small" sx={{ mr: 1 }} onClick={() => handleShowQR(table)}>
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                      <Button size="small" color="error" onClick={() => {
                        setTableToDelete(table)
                        setDeleteDialogOpen(true)
                      }} >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {tables.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No hay mesas registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para mostrar QR */}
      <SimpleTableQRCode
        table={selectedTable}
        open={qrDialogOpen}
        onClose={() => {
          setQrDialogOpen(false)
          setSelectedTable(null)
        }}
      />

      {/* Dialog para crear mesa */}
      <CreateTableDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onTableCreated={handleCreateTable}
      />

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar la Mesa {tableToDelete?.tableNumber}? Esta acción no se puede
            deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteTable} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
