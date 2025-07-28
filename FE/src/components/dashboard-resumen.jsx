import { Grid, Card, CardContent, Typography, Box, LinearProgress } from "@mui/material"

const weeklyData = [
  { name: "Lun", sales: 1200, percentage: 33 },
  { name: "Mar", sales: 1900, percentage: 53 },
  { name: "Mié", sales: 1100, percentage: 31 },
  { name: "Jue", sales: 2400, percentage: 67 },
  { name: "Vie", sales: 3100, percentage: 86 },
  { name: "Sáb", sales: 3600, percentage: 100 },
  { name: "Dom", sales: 3400, percentage: 94 },
]

export default function DashboardOverview() {
  return (
    <>
      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                $ Ingresos Totales
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                $15,231
              </Typography>
              <Typography variant="body2" color="success.main">
                +20.1% desde el mes pasado
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                • Pedidos
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                624
              </Typography>
              <Typography variant="body2" color="success.main">
                +15% desde el mes pasado
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                ◦ Clientes
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                1,234
              </Typography>
              <Typography variant="body2" color="success.main">
                +8% desde el mes pasado
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                ↗ Crecimiento
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                +12.5%
              </Typography>
              <Typography variant="body2" color="success.main">
                +2% desde el mes pasado
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ▬ Ventas Semanales
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
                          backgroundColor: "#f44336",
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ◐ Tipos de Pedidos
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body1">• En Local</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      65%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={65}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#f5f5f5",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#f44336",
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body1">◦ Para Llevar</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      35%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={35}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#f5f5f5",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#ff9800",
                      },
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
