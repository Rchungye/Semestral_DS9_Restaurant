import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <Box sx={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Typography variant="h3" color="success.main" gutterBottom>
        ¡Pago realizado con éxito!
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
        Gracias por tu pedido. Pronto comenzaremos a prepararlo.
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Volver al inicio
      </Button>
    </Box>
  );
}