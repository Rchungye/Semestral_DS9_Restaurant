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

const users = [
  { id: 1, name: "Admin User", email: "admin@goldenpanda.com", role: "Administrador", status: "Activo" },
  { id: 2, name: "Chef Wang", email: "chef@goldenpanda.com", role: "Cocinero", status: "Activo" },
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

export default function UserManagement() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            + Gestión de Usuarios
          </Typography>
          <Button variant="contained" color="error">
            + Agregar Usuario
          </Button>
        </Box>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Usuarios del Sistema
        </Typography>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      variant="outlined"
                      color={user.role === "Administrador" ? "primary" : "secondary"}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={user.status} size="small" color={getStatusColor(user.status)} />
                  </TableCell>
                  <TableCell>
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
