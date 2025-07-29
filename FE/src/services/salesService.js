import { ApiService, getAuthHeaders } from "./api.config"

// Función helper para debug mejorado
const debugResponse = async (url, response) => {
  console.log("🔍 Debug Info:")
  console.log("URL:", url)
  console.log("Status:", response.status)
  console.log("Headers:", Object.fromEntries(response.headers.entries()))

  const responseClone = response.clone()
  const text = await responseClone.text()
  console.log("Response text (first 500 chars):", text.substring(0, 500))

  return text
}

// Obtener estadísticas de ventas por período
export const getSalesStats = async (startDate, endDate) => {
  try {
    const url = `${ApiService}/api/admin/sales/stats?startDate=${startDate}&endDate=${endDate}`

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching sales stats:", error)
    throw error
  }
}

// Obtener transacciones de hoy
export const getTodayTransactions = async () => {
  try {
    const url = `${ApiService}/api/admin/transactions/today`

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching today transactions:", error)
    throw error
  }
}

// Obtener historial de transacciones con debug mejorado
export const getTransactionHistory = async (startDate, endDate) => {
  try {
    const url = `${ApiService}/api/admin/sales/history?startDate=${startDate}&endDate=${endDate}`

    console.log("🚀 Fetching transaction history...")
    console.log("URL:", url)
    console.log("ApiService:", ApiService)
    console.log("ApiService type:", typeof ApiService)

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    console.log("📡 Response received:")
    console.log("Status:", response.status)
    console.log("OK:", response.ok)

    if (!response.ok) {
      const errorText = await debugResponse(url, response)
      throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 200)}`)
    }

    // Verificar si la respuesta es JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await debugResponse(url, response)
      throw new Error(`Expected JSON but got: ${contentType}. Response: ${errorText.substring(0, 200)}`)
    }

    const data = await response.json()
    console.log("✅ Data received:", data)
    return data
  } catch (error) {
    console.error("❌ Error fetching transaction history:", error)
    throw error
  }
}

// Función de prueba simple para verificar conectividad
export const testBackendConnection = async () => {
  try {
    const url = `${ApiService}/api/admin/transactions`

    console.log("🧪 Testing backend connection...")
    console.log("URL:", url)
    console.log("ApiService value:", ApiService)
    console.log("ApiService type:", typeof ApiService)

    // Verificar que ApiService sea una string
    if (typeof ApiService !== "string") {
      throw new Error(`ApiService should be a string, but got: ${typeof ApiService}`)
    }

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    console.log("Test response status:", response.status)

    if (response.ok) {
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()
        console.log("✅ Backend connection successful:", data)
        return { success: true, data }
      } else {
        const text = await response.text()
        console.log("⚠️ Backend returned non-JSON:", text.substring(0, 200))
        return { success: false, error: `Expected JSON but got: ${contentType}` }
      }
    } else {
      const errorText = await response.text()
      console.log("❌ Backend connection failed:", errorText)
      return { success: false, error: errorText }
    }
  } catch (error) {
    console.error("❌ Backend connection error:", error)
    return { success: false, error: error.message }
  }
}

// Obtener resumen financiero del día
export const getFinancialSummary = async () => {
  try {
    const url = `${ApiService}/api/admin/financial/summary`

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching financial summary:", error)
    throw error
  }
}

// Obtener datos de la semana con validación mejorada
export const getWeeklyData = async () => {
  try {
    // Verificar que ApiService sea válido
    if (typeof ApiService !== "string") {
      throw new Error(`ApiService configuration error: expected string, got ${typeof ApiService}`)
    }

    // Primero probar la conexión
    const connectionTest = await testBackendConnection()
    if (!connectionTest.success) {
      throw new Error(`Backend connection failed: ${connectionTest.error}`)
    }

    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const startDate = weekAgo.toISOString().split("T")[0]
    const endDate = today.toISOString().split("T")[0]

    console.log("📅 Date range:", { startDate, endDate })

    const history = await getTransactionHistory(startDate, endDate)

    // Procesar datos para formato del componente
    const weeklyData = []
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const dayName = days[date.getDay()]
      const dateStr = date.toISOString().split("T")[0]

      // Filtrar transacciones del día
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

    console.log("📊 Weekly data processed:", weeklyData)
    return weeklyData
  } catch (error) {
    console.error("Error getting weekly data:", error)
    throw error
  }
}

// FE/src/services/salesService.js
import axios from 'axios';
import { API_BASE_URL } from './api.config';

export const getSalesStats = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/sales/stats`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales stats:', error);
    throw error;
  }
};

export const getDailySales = async () => {
  const today = new Date().toISOString().split('T')[0];
  return getSalesStats(today, today);
};

export const getWeeklySales = async () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);
  
  return getSalesStats(
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );
};
