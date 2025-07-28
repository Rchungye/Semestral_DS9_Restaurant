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
} from "@mui/material"

const tables = [
  { number: "Mesa 1", seats: "4 asientos", status: "Disponible", qrCode: "QR001" },
  { number: "Mesa 2", seats: "2 asientos", status: "Ocupada", qrCode: "QR002" },
  { number: "Mesa 3", seats: "6 asientos", status: "Disponible", qrCode: "QR003" },
  { number: "Mesa 4", seats: "4 asientos", status: "Reservada", qrCode: "QR004" },
]

const getStatusColor = (status) => {
  switch (status) {
    case "Disponible":
      return "success"
    case "Ocupada":
      return "primary"
    case "Reservada":
      return "warning"
    default:
      return "default"
  }
}

export default function TableManagement() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            □ Gestión de Mesas
          </Typography>
          <Button variant="contained" color="error">
            + Agregar Mesa
          </Button>
        </Box>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Mesas del Restaurante
        </Typography>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número de Mesa</TableCell>
                <TableCell>Asientos</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Código QR</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tables.map((table, index) => (
                <TableRow key={index}>
                  <TableCell>{table.number}</TableCell>
                  <TableCell>{table.seats}</TableCell>
                  <TableCell>
                    <Chip label={table.status} size="small" color={getStatusColor(table.status)} />
                  </TableCell>
                  <TableCell>{table.qrCode}</TableCell>
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
  )
}
