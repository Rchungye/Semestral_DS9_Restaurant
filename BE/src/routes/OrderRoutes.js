// src/routes/OrderRoutes.js
import {
  listOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getKitchenOrders,
  updateOrderStatus,
  getOrdersByStatus,
  getOrdersByType,
  getOrderHistory,
  getTodayOrders,
  getDailyStats,
  getOrderByInvoice
} from '../services/OrderServices.js'

import { verificarToken, verificarAdmin, verificarCocina } from '../middleware/AuthMiddleware.js'

export default function (fastify) {
  // ============= CRUD BÁSICO (Solo administradores) =============
  fastify.get('/api/orders', { preHandler: verificarAdmin }, listOrders)
  fastify.get('/api/orders/:id', { preHandler: verificarToken }, getOrder)
  fastify.post('/api/orders', { preHandler: verificarToken }, createOrder)
  fastify.put('/api/orders/:id', { preHandler: verificarAdmin }, updateOrder)
  fastify.delete('/api/orders/:id', { preHandler: verificarAdmin }, deleteOrder)

  // ============= ENDPOINTS PARA COCINEROS =============
  // US-012: Visualizar órdenes para cocina
  fastify.get('/api/kitchen/orders', { preHandler: verificarCocina }, getKitchenOrders)
  
  // US-015 y US-016: Cambiar estado de órdenes
  fastify.patch('/api/kitchen/orders/:id/status', { preHandler: verificarCocina }, updateOrderStatus)

  // ============= ENDPOINTS PARA ADMINISTRADORES =============
  // US-023: Supervisar flujo en tiempo real
  fastify.get('/api/admin/orders/status', { preHandler: verificarAdmin }, getOrdersByStatus)
  
  // US-021: Órdenes por tipo (local/takeout)
  fastify.get('/api/admin/orders/type/:type', { preHandler: verificarAdmin }, getOrdersByType)
  
  // US-022: Historial de ventas con filtros
  fastify.get('/api/admin/orders/history', { preHandler: verificarAdmin }, getOrderHistory)
  
  // Órdenes de hoy
  fastify.get('/api/admin/orders/today', { preHandler: verificarAdmin }, getTodayOrders)
  
  // US-021: Estadísticas diarias
  fastify.get('/api/admin/stats/daily', { preHandler: verificarAdmin }, getDailyStats)

  // ============= ENDPOINTS PÚBLICOS PARA CLIENTES =============
  // US-008: Crear pedido para llevar (sin autenticación)
  fastify.post('/public/orders/takeout', createOrder)
  
  // US-001: Crear pedido local via QR (sin autenticación)
  fastify.post('/public/orders/local', createOrder)
  
  // Consultar orden por número de factura (takeout)
  fastify.get('/public/orders/invoice/:invoice', getOrderByInvoice)

  // ============= ENDPOINTS ADICIONALES =============
  // Webhook para notificaciones en tiempo real (futuro)
  // fastify.post('/api/orders/:id/notify', { preHandler: verificarToken }, notifyOrderUpdate)
}