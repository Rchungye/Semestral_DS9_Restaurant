"use client"

import { useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Alert } from "@mui/material"

export default function CreateTableDialog({ open, onClose, onTableCreated }) {
  const [formData, setFormData] = useState({
    tableNumber: "",
    capacity: "4",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const tableData = {
        tableNumber: Number.parseInt(formData.tableNumber),
        capacity: Number.parseInt(formData.capacity),
      }

      await onTableCreated(tableData)

      // Reset form
      setFormData({ tableNumber: "", capacity: "4" })
      onClose()
    } catch (error) {
      setError(error.response?.data?.error || "Error al crear la mesa")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ tableNumber: "", capacity: "4" })
    setError("")
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Agregar Nueva Mesa</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              name="tableNumber"
              label="Número de Mesa"
              type="number"
              value={formData.tableNumber}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
              inputProps={{ min: 1 }}
            />

            <TextField
              name="capacity"
              label="Capacidad (personas)"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 1, max: 20 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Creando..." : "Crear Mesa"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
