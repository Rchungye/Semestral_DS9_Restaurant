import { ApiService } from "./api.config"

// ============= FUNCIONES PARA ADMIN =============

// Obtener estadísticas de ventas por período
export const getSalesStats = async (startDate, endDate) => {
  try {
    const response = await ApiService.get(`/api/admin/sales/stats?startDate=${startDate}&endDate=${endDate}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener las estadísticas de ventas:", error)
    return {
      period: { startDate, endDate },
      revenue: { totalRevenue: 0, totalTaxes: 0, totalTransactions: 0, averageTransaction: 0 },
      dailyBreakdown: [],
      paymentMethods: [],
    }
  }
}

// Obtener transacciones de hoy
export const getTodayTransactions = async () => {
  try {
    const response = await ApiService.get("/api/admin/transactions/today")
    return response.data
  } catch (error) {
    console.error("Error al obtener las transacciones de hoy:", error)
    return []
  }
}

// Obtener historial de transacciones
export const getTransactionHistory = async (startDate, endDate) => {
  try {
    const response = await ApiService.get(`/api/admin/sales/history?startDate=${startDate}&endDate=${endDate}`)
    return response.data
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    return {
      period: { startDate, endDate },
      transactions: [],
      count: 0,
    }
  }
}

// Obtener todas las transacciones (admin)
export const getAllTransactions = async () => {
  try {
    const response = await ApiService.get("/api/admin/transactions")
    return response.data
  } catch (error) {
    console.error("Error fetching all transactions:", error)
    return []
  }
}

// Obtener resumen financiero del día
export const getFinancialSummary = async () => {
  try {
    const response = await ApiService.get("/api/admin/financial/summary")
    return response.data
  } catch (error) {
    console.error("Error al obtener todas las transacciones:", error)
    return {
      date: new Date().toISOString().split("T")[0],
      summary: {
        totalRevenue: 0,
        totalTaxes: 0,
        totalTransactions: 0,
        averageTransaction: 0,
      },
      recentTransactions: [],
    }
  }
}

// ============= NUEVAS FUNCIONES PARA DASHBOARD =============

// Obtener métricas del dashboard usando las funciones del backend
export const getDashboardMetrics = async () => {
  try {
    const today = new Date()
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)

    const todayStr = today.toISOString().split("T")[0]
    const currentMonthStr = currentMonth.toISOString().split("T")[0]
    const lastMonthStr = lastMonth.toISOString().split("T")[0]
    const lastMonthEndStr = lastMonthEnd.toISOString().split("T")[0]

    // Obtener datos del mes actual y anterior usando las funciones del backend
    const [currentMonthData, lastMonthData] = await Promise.all([
      getTransactionHistory(currentMonthStr, todayStr),
      getTransactionHistory(lastMonthStr, lastMonthEndStr),
    ])

    // Calcular métricas basándose en la estructura real del backend
    const currentRevenue = currentMonthData.transactions?.reduce((sum, t) => sum + t.total, 0) || 0
    const lastRevenue = lastMonthData.transactions?.reduce((sum, t) => sum + t.total, 0) || 0
    const revenueGrowth = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0

    const currentOrders = currentMonthData.transactions?.length || 0
    const lastOrders = lastMonthData.transactions?.length || 0
    const ordersGrowth = lastOrders > 0 ? ((currentOrders - lastOrders) / lastOrders) * 100 : 0

    // Calcular clientes únicos usando customerName de las órdenes populadas
    const currentCustomers = new Set(currentMonthData.transactions?.map((t) => t.orderId?.customerName).filter(Boolean))
      .size
    const lastCustomers = new Set(lastMonthData.transactions?.map((t) => t.orderId?.customerName).filter(Boolean)).size
    const customersGrowth = lastCustomers > 0 ? ((currentCustomers - lastCustomers) / lastCustomers) * 100 : 0

    return {
      totalRevenue: currentRevenue,
      revenueGrowth: revenueGrowth,
      totalOrders: currentOrders,
      ordersGrowth: ordersGrowth,
      totalCustomers: currentCustomers,
      customersGrowth: customersGrowth,
      overallGrowth: (revenueGrowth + ordersGrowth + customersGrowth) / 3,
    }
  } catch (error) {
    console.error("Error al obtener las métricas del panel:", error)
    return {
      totalRevenue: 0,
      revenueGrowth: 0,
      totalOrders: 0,
      ordersGrowth: 0,
      totalCustomers: 0,
      customersGrowth: 0,
      overallGrowth: 0,
    }
  }
}

// Obtener datos de ventas semanales para el dashboard
export const getWeeklyDashboardData = async () => {
  try {
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const startDate = weekAgo.toISOString().split("T")[0]
    const endDate = today.toISOString().split("T")[0]

    const history = await getTransactionHistory(startDate, endDate)

    // Procesar datos para formato del componente
    const weeklyData = []
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const dayName = days[date.getDay()]
      const dateStr = date.toISOString().split("T")[0]

      // Filtrar transacciones del día usando saleDate del modelo
      const dayTransactions = (history.transactions || []).filter((transaction) => {
        const transactionDate = new Date(transaction.saleDate).toISOString().split("T")[0]
        return transactionDate === dateStr
      })

      const dayTotal = dayTransactions.reduce((sum, transaction) => sum + transaction.total, 0)

      weeklyData.push({
        name: dayName,
        sales: dayTotal,
        date: dateStr,
      })
    }

    // Calcular porcentajes basados en el día con más ventas
    const maxSales = Math.max(...weeklyData.map((day) => day.sales))
    weeklyData.forEach((day) => {
      day.percentage = maxSales > 0 ? Math.round((day.sales / maxSales) * 100) : 0
    })

    return weeklyData
  } catch (error) {
    console.error("Error al obtener los datos del panel semanal:", error)
    return [
      { name: "Lun", sales: 0, percentage: 0 },
      { name: "Mar", sales: 0, percentage: 0 },
      { name: "Mié", sales: 0, percentage: 0 },
      { name: "Jue", sales: 0, percentage: 0 },
      { name: "Vie", sales: 0, percentage: 0 },
      { name: "Sáb", sales: 0, percentage: 0 },
      { name: "Dom", sales: 0, percentage: 0 },
    ]
  }
}

// Obtener estadísticas de tipos de pedidos usando el campo 'type' de Order
export const getOrderTypesStats = async () => {
  try {
    const today = new Date()
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const startDate = monthAgo.toISOString().split("T")[0]
    const endDate = today.toISOString().split("T")[0]

    const history = await getTransactionHistory(startDate, endDate)

    // Contar tipos de pedidos basándose en orderId.type (que viene populado)
    let localOrders = 0
    let takeawayOrders = 0

    history.transactions?.forEach((transaction) => {
      const orderType = transaction.orderId?.type
      if (orderType === "local") {
        localOrders++
      } else if (orderType === "para-llevar") {
        takeawayOrders++
      }
    })

    const totalOrders = localOrders + takeawayOrders
    const localPercentage = totalOrders > 0 ? Math.round((localOrders / totalOrders) * 100) : 0
    const takeawayPercentage = totalOrders > 0 ? Math.round((takeawayOrders / totalOrders) * 100) : 0

    return {
      local: {
        count: localOrders,
        percentage: localPercentage,
      },
      takeaway: {
        count: takeawayOrders,
        percentage: takeawayPercentage,
      },
      total: totalOrders,
    }
  } catch (error) {
    console.error("Error al obtener las estadísticas de tipos de pedidos:", error)
    return {
      local: { count: 0, percentage: 0 },
      takeaway: { count: 0, percentage: 0 },
      total: 0,
    }
  }
}

// ============= FUNCIÓN ORIGINAL PARA VENTAS-ADMIN =============

// Obtener datos de la semana para el componente ventas-admin
export const getWeeklyData = async () => {
  try {
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const startDate = weekAgo.toISOString().split("T")[0]
    const endDate = today.toISOString().split("T")[0]

    const history = await getTransactionHistory(startDate, endDate)

    // Procesar datos para formato del componente
    const weeklyData = []
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const dayName = days[date.getDay()]
      const dateStr = date.toISOString().split("T")[0]

      // Filtrar transacciones del día usando saleDate
      const dayTransactions = (history.transactions || []).filter((transaction) => {
        const transactionDate = new Date(transaction.saleDate).toISOString().split("T")[0]
        return transactionDate === dateStr
      })

      const dayTotal = dayTransactions.reduce((sum, transaction) => sum + transaction.total, 0)
      const orderCount = dayTransactions.length

      weeklyData.push({
        name: dayName,
        sales: dayTotal,
        orders: orderCount,
        date: dateStr,
      })
    }

    // Calcular porcentajes basados en el día con más ventas
    const maxSales = Math.max(...weeklyData.map((day) => day.sales))
    weeklyData.forEach((day) => {
      day.percentage = maxSales > 0 ? Math.round((day.sales / maxSales) * 100) : 0
    })

    return weeklyData
  } catch (error) {
    console.error("Error al obtener datos semanales:", error)
    return [
      { name: "Lun", sales: 0, orders: 0, percentage: 0 },
      { name: "Mar", sales: 0, orders: 0, percentage: 0 },
      { name: "Mié", sales: 0, orders: 0, percentage: 0 },
      { name: "Jue", sales: 0, orders: 0, percentage: 0 },
      { name: "Vie", sales: 0, orders: 0, percentage: 0 },
      { name: "Sáb", sales: 0, orders: 0, percentage: 0 },
      { name: "Dom", sales: 0, orders: 0, percentage: 0 },
    ]
  }
}

// ============= FUNCIONES PÚBLICAS =============

// Procesar pago (público)
export const processPayment = async (paymentData) => {
  try {
    const response = await ApiService.post("/api/payments/process", paymentData)
    return response.data
  } catch (error) {
    console.error("Error al procesar el pago:", error)
    throw error
  }
}

// Obtener estado de pago (público)
export const getPaymentStatus = async (orderId) => {
  try {
    const response = await ApiService.get(`/api/payments/status/${orderId}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener el estado del pago:", error)
    return null
  }
}
