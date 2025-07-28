"use client"

import { useState } from "react"
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
} from "@mui/material"

const menuItems = [
  { id: 1, name: "Kung Pao Chicken", category: "Platos Principales", price: "$16.99", status: "Activo" },
  { id: 2, name: "Sweet & Sour Pork", category: "Platos Principales", price: "$18.99", status: "Activo" },
  { id: 3, name: "Mapo Tofu", category: "Platos Principales", price: "$14.99", status: "Activo" },
  { id: 4, name: "Fried Rice", category: "Arroz y Fideos", price: "$12.99", status: "Activo" },
  { id: 5, name: "Hot & Sour Soup", category: "Sopas", price: "$8.99", status: "Inactivo" },
]

const getStatusColor = (status) => {
  switch (status) {
    case "Activo":
      return "success"
    case "Inactivo":
      return "error"
    default:
      return "default"
  }
}

export default function MenuManagement() {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              ☰ Gestión de Menú
            </Typography>
            <Button variant="contained" color="error" onClick={() => setOpenDialog(true)}>
              + Agregar Item
            </Button>
          </Box>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Items del Menú
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <Chip label={item.status} size="small" color={getStatusColor(item.status)} />
                    </TableCell>
                    <TableCell>
                      <Button size="small" sx={{ mr: 1 }}>
                        ◦
                      </Button>
                      <Button size="small" sx={{ mr: 1 }}>
                        ✎
                      </Button>
                      <Button size="small" color="error">
                        ×
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para agregar items */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Nuevo Item al Menú</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre del Plato" sx={{ mb: 2, mt: 1 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Categoría</InputLabel>
            <Select label="Categoría">
              <MenuItem value="principales">Platos Principales</MenuItem>
              <MenuItem value="arroz">Arroz y Fideos</MenuItem>
              <MenuItem value="sopas">Sopas</MenuItem>
              <MenuItem value="postres">Postres</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Precio" sx={{ mb: 2 }} />
          <TextField fullWidth label="Descripción" multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={() => setOpenDialog(false)}>
            Agregar Item
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
