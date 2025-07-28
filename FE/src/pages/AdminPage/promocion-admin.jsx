import { Card, CardContent, Typography, Box, Button, Chip } from "@mui/material"

const promotions = [
  {
    name: "Weekend Special",
    description: "20% off en platos principales los fines de semana",
    validity: "Sáb-Dom",
    expires: "Dec 31, 2024",
    status: "Activa",
  },
  {
    name: "Lunch Combo",
    description: "Compra 2 platos principales, obtén 1 sopa gratis",
    validity: "11:00 AM - 3:00 PM",
    starts: "Jan 1, 2025",
    status: "Programada",
  },
]

const getStatusColor = (status) => {
  switch (status) {
    case "Activa":
      return "success"
    case "Programada":
      return "warning"
    default:
      return "default"
  }
}

export default function PromotionsManagement() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            ◆ Promociones y Descuentos
          </Typography>
          <Button variant="contained" color="error">
            + Crear Promoción
          </Button>
        </Box>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Promociones Activas
        </Typography>
        {promotions.map((promo, index) => (
          <Card key={index} sx={{ mb: 2, border: "1px solid #e0e0e0" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {promo.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {promo.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Válido: {promo.validity}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Chip label={promo.status} size="small" color={getStatusColor(promo.status)} sx={{ mb: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    {promo.expires ? `Expira: ${promo.expires}` : `Inicia: ${promo.starts}`}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
