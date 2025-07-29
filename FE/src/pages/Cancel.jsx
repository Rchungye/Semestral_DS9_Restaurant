import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <Box sx={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Typography variant="h3" color="error.main" gutterBottom>
        Pago cancelado
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
        El pago fue cancelado o no se completó. Puedes intentarlo de nuevo.
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Volver al inicio
      </Button>
    </Box>
  );
}