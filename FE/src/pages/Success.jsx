import { Box, Typography, Button } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { updateOrderStatusPublic } from "../services/orderService";

export default function Success() {
  const [searchParams] = useSearchParams();
  const [statusMsg, setStatusMsg] = useState("Actualizando estado del pedido...");

  useEffect(() => {
    const orderId = searchParams.get("orderId") || localStorage.getItem("lastOrderId");
    if (orderId) {
      updateOrderStatusPublic(orderId)
        .then(() => setStatusMsg("¡Pago realizado con éxito!"))
        .catch(() => setStatusMsg("¡Pago realizado, pero no se pudo actualizar el estado del pedido."));
      // Limpia el orderId guardado
      localStorage.removeItem("lastOrderId");
    } else {
      setStatusMsg("¡Pago realizado! (No se encontró el pedido para actualizar)");
    }
  }, [searchParams]);

  return (
    <Box sx={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Typography variant="h3" color="success.main" gutterBottom>
        {statusMsg}
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