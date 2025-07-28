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
} from "@mui/material"

const orders = [
  {
    id: "GP-2024-001",
    customer: "Juan Pérez",
    type: "Para Llevar",
    items: "3 items",
    total: "$37.58",
    status: "Completado",
    time: "hace 2 horas",
  },
  {
    id: "GP-2024-002",
    customer: "María García",
    type: "En Local",
    items: "5 items",
    total: "$52.97",
    status: "En Proceso",
    time: "hace 30 min",
  },
  {
    id: "GP-2024-003",
    customer: "Carlos López",
    type: "Para Llevar",
    items: "2 items",
    total: "$19.98",
    status: "Listo",
    time: "hace 15 min",
  },
]

const getStatusColor = (status) => {
  switch (status) {
    case "Completado":
      return "success"
    case "En Proceso":
      return "primary"
    case "Listo":
      return "warning"
    default:
      return "default"
  }
}

export default function OrderManagement() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          ◉ Gestión de Pedidos
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Todos los Pedidos
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filtrar por estado</InputLabel>
            <Select label="Filtrar por estado">
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="completado">Completado</MenuItem>
              <MenuItem value="proceso">En Proceso</MenuItem>
              <MenuItem value="listo">Listo</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filtrar por tipo</InputLabel>
            <Select label="Filtrar por tipo">
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="local">En Local</MenuItem>
              <MenuItem value="llevar">Para Llevar</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Pedido</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Tiempo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
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
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Chip label={order.status} size="small" color={getStatusColor(order.status)} />
                  </TableCell>
                  <TableCell>{order.time}</TableCell>
                  <TableCell>
                    <Button size="small">◦</Button>
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
