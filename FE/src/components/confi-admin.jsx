import { Card, CardContent, Typography, Grid, TextField, Button } from "@mui/material"

export default function SettingsManagement() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          ⚙ Configuración del Sistema
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ border: "1px solid #e0e0e0" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Configuración General
                </Typography>
                <TextField fullWidth label="Nombre del Restaurante" defaultValue="Golden Panda" sx={{ mb: 2 }} />
                <TextField fullWidth label="Dirección" defaultValue="123 Main St, Ciudad" sx={{ mb: 2 }} />
                <TextField fullWidth label="Teléfono" defaultValue="+1 234 567 8900" sx={{ mb: 2 }} />
                <Button variant="contained" color="primary">
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ border: "1px solid #e0e0e0" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Configuración de Pedidos
                </Typography>
                <TextField fullWidth label="Tiempo de Preparación (min)" defaultValue="30" sx={{ mb: 2 }} />
                <TextField fullWidth label="Impuesto (%)" defaultValue="8.5" sx={{ mb: 2 }} />
                <TextField fullWidth label="Propina Sugerida (%)" defaultValue="15" sx={{ mb: 2 }} />
                <Button variant="contained" color="primary">
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
