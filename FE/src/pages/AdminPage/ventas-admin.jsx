"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, Typography, Grid, Box, LinearProgress, CircularProgress, Alert } from "@mui/material"
import { getWeeklyData } from "../../services/salesService"

export default function SalesAnalytics() {
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getWeeklyData()
        setWeeklyData(data)
        setError(null)
      } catch (err) {
        console.error("Error loading sales data:", err)
        setError("Error al cargar los datos de ventas")
        // Datos de fallback en caso de error
        setWeeklyData([
          { name: "Lun", sales: 0, orders: 0, percentage: 0 },
          { name: "Mar", sales: 0, orders: 0, percentage: 0 },
          { name: "Mié", sales: 0, orders: 0, percentage: 0 },
          { name: "Jue", sales: 0, orders: 0, percentage: 0 },
          { name: "Vie", sales: 0, orders: 0, percentage: 0 },
          { name: "Sáb", sales: 0, orders: 0, percentage: 0 },
          { name: "Dom", sales: 0, orders: 0, percentage: 0 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          ▲ Análisis de Ventas
        </Typography>

        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
                      ${day.sales.toFixed(2)}
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
                      {day.orders} pedidos
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
