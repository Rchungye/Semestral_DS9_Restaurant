// Cambiar estado de una orden a 'pendiente' (endpoint público)
export const updateOrderStatusPublic = async (orderId) => {
  const response = await ApiService.patch(`/api/orders/${orderId}/status`, { status: 'pendiente' });
  return response.data;
};
import { ApiService } from "./api.config"

// ============= GESTIÓN DE ÓRDENES =============

// Crear una nueva orden
export const createOrder = async (orderData) => {
  try {
    const response = await ApiService.post("/api/orders", orderData)
    return response.data
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

// Obtener detalles del carrito por orderId
export const getCartDetails = async (orderId) => {
  try {
    const response = await ApiService.get(`/api/orders/${orderId}/cart`)
    return response.data
  } catch (error) {
    console.error("Error fetching cart details:", error)
    throw error
  }
}

export const updateOrderStatusKitchen = async (orderId, status) => {
  const response = await ApiService.patch(`/api/kitchen/orders/${orderId}/status`, { status });
  return response.data;
};

// ============= GESTIÓN DE ORDER DETAILS =============

// Crear un detalle de orden individual (agregar item al carrito)
export const createOrderDetail = async (orderDetailData) => {
  try {
    const response = await ApiService.post("/api/orders/details", orderDetailData)
    return response.data
  } catch (error) {
    console.error("Error creating order detail:", error)
    throw error
  }
}

// Crear múltiples detalles de orden (confirmar carrito completo)
export const createMultipleOrderDetails = async (orderId, items) => {
  try {
    const response = await ApiService.post("/api/orders/details/bulk", {
      orderId,
      items,
    })
    return response.data
  } catch (error) {
    console.error("Error creating multiple order details:", error)
    throw error
  }
}

// Actualizar cantidad o personalizaciones en el carrito
export const updateOrderDetail = async (orderDetailId, updateData) => {
  try {
    const response = await ApiService.put(`/api/orders/details/${orderDetailId}`, updateData)
    return response.data
  } catch (error) {
    console.error("Error updating order detail:", error)
    throw error
  }
}

// Eliminar item del carrito
export const deleteOrderDetail = async (orderDetailId) => {
  try {
    const response = await ApiService.delete(`/api/orders/details/${orderDetailId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting order detail:", error)
    throw error
  }
}

// Obtener estadísticas de platillos más vendidos
export const getMostOrderedDishes = async (limit = 10) => {
  try {
    const response = await ApiService.get(`/api/admin/order-details/stats/most-ordered?limit=${limit}`)
    return response.data
  } catch (error) {
    console.error("Error fetching most ordered dishes:", error)
    throw error
  }
}

// ============= FUNCIONES PARA ADMIN =============

// Obtener todas las órdenes (admin)
export const fetchAllOrders = async () => {
  try {
    const response = await ApiService.get("/api/admin/orders")
    return response.data
  } catch (error) {
    console.error("Error fetching all orders:", error)
    return []
  }
}

// Obtener una orden específica por ID
export const fetchOrderById = async (id) => {
  try {
    const response = await ApiService.get(`/api/admin/orders/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}

// Actualizar una orden (admin)
export const updateOrder = async (id, orderData) => {
  try {
    const response = await ApiService.put(`/api/admin/orders/${id}`, orderData)
    return response.data
  } catch (error) {
    console.error("Error updating order:", error)
    throw error
  }
}

// Eliminar una orden (admin)
export const deleteOrder = async (id) => {
  try {
    const response = await ApiService.delete(`/api/admin/orders/${id}`)
    return response.data
  } catch (error) {
    console.error("Error deleting order:", error)
    throw error
  }
}

// Obtener órdenes por estado
export const fetchOrdersByStatus = async (status) => {
  try {
    const response = await ApiService.get(`/api/admin/orders/monitor?status=${status}`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders by status:", error)
    return []
  }
}

// Obtener órdenes de hoy
export const fetchTodayOrders = async () => {
  try {
    const response = await ApiService.get("/api/admin/orders/today")
    return response.data
  } catch (error) {
    console.error("Error fetching today orders:", error)
    return []
  }
}

// Obtener estadísticas diarias
export const fetchDailyStats = async (date) => {
  try {
    const dateParam = date ? `?date=${date}` : ""
    const response = await ApiService.get(`/api/admin/dashboard/stats${dateParam}`)
    return response.data
  } catch (error) {
    console.error("Error fetching daily stats:", error)
    return null
  }
}

// Obtener todas las órdenes (cocina)
export const fetchKitchenOrders = async () => {
  try {
    const response = await ApiService.get("/api/kitchen/orders")
    return response.data
  } catch (error) {
    console.error("Error fetching kitchen orders:", error)
    return []
  }
}