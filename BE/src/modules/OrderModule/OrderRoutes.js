// src/modules/OrderModule/OrderRoutes.js
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
    getTodayOrders,
    getDailyStats,
    getOrderByInvoice
} from './OrderServices.js'

import { verificarAdmin, verificarCocina } from '../../middleware/AuthMiddleware.js'

// Rutas de administrador
export function orderAdminRoutes(fastify) {
    fastify.get('/api/admin/orders', { preHandler: verificarAdmin }, listOrders)
    fastify.get('/api/admin/orders/:id', { preHandler: verificarAdmin }, getOrder)
    fastify.put('/api/admin/orders/:id', { preHandler: verificarAdmin }, updateOrder)
    fastify.delete('/api/admin/orders/:id', { preHandler: verificarAdmin }, deleteOrder)



    // US-023: Supervisar flujo en tiempo real de pedidos
    fastify.get('/api/admin/orders/monitor', { preHandler: verificarAdmin }, getOrdersByStatus)
    // US-021: Estadísticas de ventas diarias
    fastify.get('/api/admin/dashboard/stats', { preHandler: verificarAdmin }, getDailyStats)
    // Órdenes de hoy para dashboard
    fastify.get('/api/admin/orders/today', { preHandler: verificarAdmin }, getTodayOrders)
    // Órdenes por tipo (local/takeout) para análisis
    fastify.get('/api/admin/orders/type/:type', { preHandler: verificarAdmin }, getOrdersByType)



}

// Rutas públicas
export function orderPublicRoutes(fastify) {
    // US-001: Crear pedido local via QR (escaneo de mesa)
    fastify.post('/api/orders/local', createOrder)
    // US-008: Crear pedido para llevar (sin QR)
    fastify.post('/api/orders/takeout', createOrder)
    // US-010: Consultar orden por número de factura (confirmación)
    fastify.get('/api/orders/invoice/:invoice', getOrderByInvoice)
    // US-011: Consultar estado de orden (tiempo estimado)
    fastify.get('/api/orders/:id/status', getOrder)
}

// Rutas cocina
export function orderChefRoutes(fastify) {
    // US-012, US-013, US-014: Visualizar órdenes para cocina con info de mesa/factura
    fastify.get('/api/kitchen/orders', { preHandler: verificarCocina }, getKitchenOrders)
    // US-015 y US-016: Cambiar estado de órdenes (preparando → finalizado)
    fastify.patch('/api/kitchen/orders/:id/status', { preHandler: verificarCocina }, updateOrderStatus)

}

// Exportación por defecto (todas las rutas juntas)
export default function (fastify) {
    orderChefRoutes(fastify)
    orderAdminRoutes(fastify)
    orderPublicRoutes(fastify)
}