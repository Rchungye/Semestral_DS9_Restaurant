"use client"

import { useState, useEffect } from "react"
import { Grid, Card, CardContent, Typography, Box, LinearProgress, CircularProgress, Alert } from "@mui/material"
import { getDashboardMetrics, getWeeklyDashboardData, getOrderTypesStats } from "../../services/salesService"

export default function DashboardOverview() {
  const [metrics, setMetrics] = useState(null)
  const [weeklyData, setWeeklyData] = useState([])
  const [orderTypes, setOrderTypes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [metricsData, weeklyDataResult, orderTypesData] = await Promise.all([
          getDashboardMetrics(),
          getWeeklyDashboardData(),
          getOrderTypesStats(),
        ])

        setMetrics(metricsData)
        setWeeklyData(weeklyDataResult)
        setOrderTypes(orderTypesData)
      } catch (err) {
        console.error("Error loading dashboard data:", err)
        setError("Error al cargar los datos del dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-PA", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPercentage = (percentage) => {
    const sign = percentage >= 0 ? "+" : ""
    return `${sign}${percentage.toFixed(1)}%`
  }

  const getGrowthColor = (growth) => {
    return growth >= 0 ? "success.main" : "error.main"
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Cargando dashboard...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    )
  }

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
                {formatCurrency(metrics?.totalRevenue || 0)}
              </Typography>
              <Typography variant="body2" color={getGrowthColor(metrics?.revenueGrowth || 0)}>
                {formatPercentage(metrics?.revenueGrowth || 0)} desde el mes pasado
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
                {metrics?.totalOrders || 0}
              </Typography>
              <Typography variant="body2" color={getGrowthColor(metrics?.ordersGrowth || 0)}>
                {formatPercentage(metrics?.ordersGrowth || 0)} desde el mes pasado
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
                {metrics?.totalCustomers || 0}
              </Typography>
              <Typography variant="body2" color={getGrowthColor(metrics?.customersGrowth || 0)}>
                {formatPercentage(metrics?.customersGrowth || 0)} desde el mes pasado
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
                {formatPercentage(metrics?.overallGrowth || 0)}
              </Typography>
              <Typography variant="body2" color={getGrowthColor(metrics?.overallGrowth || 0)}>
                Promedio general
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
                        {formatCurrency(day.sales)}
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
                      {orderTypes?.local?.percentage || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={orderTypes?.local?.percentage || 0}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#f5f5f5",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#f44336",
                      },
                    }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {orderTypes?.local?.count || 0} pedidos
                  </Typography>
                </Box>

                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body1">◦ Para Llevar</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {orderTypes?.takeaway?.percentage || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={orderTypes?.takeaway?.percentage || 0}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#f5f5f5",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#ff9800",
                      },
                    }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {orderTypes?.takeaway?.count || 0} pedidos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
