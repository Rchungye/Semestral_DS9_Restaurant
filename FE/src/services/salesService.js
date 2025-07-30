import { fetchAllOrders } from "./orderService"

// ============= FUNCIONES SIMPLES PARA VENTAS =============

// Obtener métricas del dashboard
export const obtenerMetricasDashboard = async () => {
  try {
    const todasLasOrdenes = await fetchAllOrders()

    // Filtrar solo órdenes completadas
    const ordenesCompletadas = todasLasOrdenes.filter(
      (orden) => orden.status === "finalizado" || orden.status === "entregado",
    )

    // Calcular totales del mes actual
    const hoy = new Date()
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

    const ordenesEsteMes = ordenesCompletadas.filter((orden) => {
      const fechaOrden = new Date(orden.orderDate)
      return fechaOrden >= inicioMes && fechaOrden <= hoy
    })

    // Calcular métricas simples
    const ingresosTotales = ordenesEsteMes.reduce((suma, orden) => suma + orden.total, 0)
    const totalOrdenes = ordenesEsteMes.length
    const totalClientes = new Set(
      ordenesEsteMes.map((orden) => orden.customerName || `Mesa-${orden.tableId?.tableNumber}`),
    ).size

    return {
      ingresosTotales,
      crecimientoIngresos: 0, // Por simplicidad, ponemos 0
      totalOrdenes,
      crecimientoOrdenes: 0,
      totalClientes,
      crecimientoClientes: 0,
      crecimientoGeneral: 0,
    }
  } catch (error) {
    console.error("Error al obtener métricas:", error)
    return {
      ingresosTotales: 0,
      crecimientoIngresos: 0,
      totalOrdenes: 0,
      crecimientoOrdenes: 0,
      totalClientes: 0,
      crecimientoClientes: 0,
      crecimientoGeneral: 0,
    }
  }
}

// Obtener datos de la semana
export const obtenerDatosSemana = async () => {
  try {
    const todasLasOrdenes = await fetchAllOrders()

    // Filtrar solo órdenes completadas de la última semana
    const hoy = new Date()
    const haceUnaSemana = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)

    const ordenesCompletadas = todasLasOrdenes.filter((orden) => {
      const fechaOrden = new Date(orden.orderDate)
      return (
        fechaOrden >= haceUnaSemana &&
        fechaOrden <= hoy &&
        (orden.status === "finalizado" || orden.status === "entregado")
      )
    })

    // Crear datos por día
    const datosSemana = []
    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy.getTime() - i * 24 * 60 * 60 * 1000)
      const nombreDia = dias[fecha.getDay()]
      const fechaString = fecha.toISOString().split("T")[0]

      // Filtrar órdenes de este día
      const ordenesDia = ordenesCompletadas.filter((orden) => {
        const fechaOrden = new Date(orden.orderDate).toISOString().split("T")[0]
        return fechaOrden === fechaString
      })

      const ventasDia = ordenesDia.reduce((suma, orden) => suma + orden.total, 0)
      const cantidadOrdenes = ordenesDia.length

      datosSemana.push({
        nombre: nombreDia,
        ventas: ventasDia,
        ordenes: cantidadOrdenes,
        fecha: fechaString,
      })
    }

    // Calcular porcentajes
    const ventasMaximas = Math.max(...datosSemana.map((dia) => dia.ventas))
    datosSemana.forEach((dia) => {
      dia.porcentaje = ventasMaximas > 0 ? Math.round((dia.ventas / ventasMaximas) * 100) : 0
    })

    return datosSemana
  } catch (error) {
    console.error("Error al obtener datos de la semana:", error)
    return [
      { nombre: "Lun", ventas: 0, ordenes: 0, porcentaje: 0 },
      { nombre: "Mar", ventas: 0, ordenes: 0, porcentaje: 0 },
      { nombre: "Mié", ventas: 0, ordenes: 0, porcentaje: 0 },
      { nombre: "Jue", ventas: 0, ordenes: 0, porcentaje: 0 },
      { nombre: "Vie", ventas: 0, ordenes: 0, porcentaje: 0 },
      { nombre: "Sáb", ventas: 0, ordenes: 0, porcentaje: 0 },
      { nombre: "Dom", ventas: 0, ordenes: 0, porcentaje: 0 },
    ]
  }
}

// Obtener estadísticas de tipos de pedidos
export const obtenerTiposPedidos = async () => {
  try {
    const todasLasOrdenes = await fetchAllOrders()

    // Filtrar órdenes completadas del último mes
    const hoy = new Date()
    const haceUnMes = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000)

    const ordenesCompletadas = todasLasOrdenes.filter((orden) => {
      const fechaOrden = new Date(orden.orderDate)
      return (
        fechaOrden >= haceUnMes && fechaOrden <= hoy && (orden.status === "finalizado" || orden.status === "entregado")
      )
    })

    // Contar tipos
    let ordenesLocal = 0
    let ordenesParaLlevar = 0

    ordenesCompletadas.forEach((orden) => {
      if (orden.type === "local") {
        ordenesLocal++
      } else if (orden.type === "takeout") {
        ordenesParaLlevar++
      }
    })

    const totalOrdenes = ordenesLocal + ordenesParaLlevar
    const porcentajeLocal = totalOrdenes > 0 ? Math.round((ordenesLocal / totalOrdenes) * 100) : 0
    const porcentajeParaLlevar = totalOrdenes > 0 ? Math.round((ordenesParaLlevar / totalOrdenes) * 100) : 0

    return {
      local: {
        cantidad: ordenesLocal,
        porcentaje: porcentajeLocal,
      },
      paraLlevar: {
        cantidad: ordenesParaLlevar,
        porcentaje: porcentajeParaLlevar,
      },
      total: totalOrdenes,
    }
  } catch (error) {
    console.error("Error al obtener tipos de pedidos:", error)
    return {
      local: { cantidad: 0, porcentaje: 0 },
      paraLlevar: { cantidad: 0, porcentaje: 0 },
      total: 0,
    }
  }
}

// ============= FUNCIONES CON NOMBRES EN INGLÉS PARA COMPATIBILIDAD =============

export const getDashboardMetrics = async () => {
  const metricas = await obtenerMetricasDashboard()
  return {
    totalRevenue: metricas.ingresosTotales,
    revenueGrowth: metricas.crecimientoIngresos,
    totalOrders: metricas.totalOrdenes,
    ordersGrowth: metricas.crecimientoOrdenes,
    totalCustomers: metricas.totalClientes,
    customersGrowth: metricas.crecimientoClientes,
    overallGrowth: metricas.crecimientoGeneral,
  }
}

export const getWeeklyDashboardData = async () => {
  const datos = await obtenerDatosSemana()
  return datos.map((dia) => ({
    name: dia.nombre,
    sales: dia.ventas,
    date: dia.fecha,
    percentage: dia.porcentaje,
  }))
}

export const getOrderTypesStats = async () => {
  const tipos = await obtenerTiposPedidos()
  return {
    local: {
      count: tipos.local.cantidad,
      percentage: tipos.local.porcentaje,
    },
    takeaway: {
      count: tipos.paraLlevar.cantidad,
      percentage: tipos.paraLlevar.porcentaje,
    },
    total: tipos.total,
  }
}

export const getWeeklyData = async () => {
  const datos = await obtenerDatosSemana()
  return datos.map((dia) => ({
    name: dia.nombre,
    sales: dia.ventas,
    orders: dia.ordenes,
    date: dia.fecha,
    percentage: dia.porcentaje,
  }))
}
