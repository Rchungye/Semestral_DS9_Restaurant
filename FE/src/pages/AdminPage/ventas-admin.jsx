import { Card, CardContent, Typography, Grid, Box, LinearProgress } from "@mui/material"

const weeklyData = [
  { name: "Lun", sales: 1200, percentage: 33 },
  { name: "Mar", sales: 1900, percentage: 53 },
  { name: "Mié", sales: 1100, percentage: 31 },
  { name: "Jue", sales: 2400, percentage: 67 },
  { name: "Vie", sales: 3100, percentage: 86 },
  { name: "Sáb", sales: 3600, percentage: 100 },
  { name: "Dom", sales: 3400, percentage: 94 },
]

export default function SalesAnalytics() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          ▲ Análisis de Ventas
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Tendencia de Ventas Diarias
            </Typography>
            <Box sx={{ mt: 2 }}>
              {weeklyData.map((day) => (
                <Box key={day.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">{day.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      ${day.sales}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={day.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#f5f5f5",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#2196f3",
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Volumen de Pedidos
            </Typography>
            <Box sx={{ mt: 2 }}>
              {weeklyData.map((day) => (
                <Box key={day.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">{day.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {Math.floor(day.sales / 30)} pedidos
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={day.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#f5f5f5",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#ff9800",
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
