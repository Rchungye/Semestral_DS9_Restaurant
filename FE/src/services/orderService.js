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
