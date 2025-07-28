// ============= src/routes/OrderDetailRoutes.js =============
import {
    listOrderDetails,
    getOrderDetail,
    createOrderDetail,
    updateOrderDetail,
    deleteOrderDetail,
    getOrderDetailsForKitchen,
    getCartDetails,
    createMultipleOrderDetails,
    getMostOrderedDishes,
    getCustomizationsForKitchen
} from '../services/OrderDetailServices.js'

import { verificarAdmin, verificarCocina } from '../middleware/AuthMiddleware.js'

export default function (fastify) {
    // ============= CRUD BÁSICO (Solo administradores) =============
    fastify.get('/api/admin/order-details', { preHandler: verificarAdmin }, listOrderDetails)
    fastify.get('/api/admin/order-details/:id', { preHandler: verificarAdmin }, getOrderDetail)
    fastify.post('/api/admin/order-details', { preHandler: verificarAdmin }, createOrderDetail)
    fastify.put('/api/admin/order-details/:id', { preHandler: verificarAdmin }, updateOrderDetail)
    fastify.delete('/api/admin/order-details/:id', { preHandler: verificarAdmin }, deleteOrderDetail)

    // ============= ENDPOINTS PARA COCINEROS =============
    // US-017: Ver personalizaciones del platillo para preparar comida correctamente
    fastify.get('/api/kitchen/orders/:orderId/details', { preHandler: verificarCocina }, getOrderDetailsForKitchen)

    // Ver solo las personalizaciones especiales
    fastify.get('/api/kitchen/orders/:orderId/customizations', { preHandler: verificarCocina }, getCustomizationsForKitchen)

    // ============= ENDPOINTS PARA ADMINISTRADORES - ANÁLISIS =============
    // Estadísticas de platillos más vendidos para análisis de menú
    fastify.get('/api/admin/analytics/popular-dishes', { preHandler: verificarAdmin }, getMostOrderedDishes)

    // ============= ENDPOINTS PÚBLICOS/SEMI-PÚBLICOS =============
    // US-006: Carrito de pedidos - mostrar items agregados
    fastify.get('/api/orders/:orderId/cart', getCartDetails)

    // Crear detalle individual de orden (agregar item al carrito)
    fastify.post('/api/orders/details', createOrderDetail)

    // Crear múltiples detalles de orden (confirmar carrito completo)
    fastify.post('/api/orders/details/bulk', createMultipleOrderDetails)

    // Actualizar cantidad o personalizaciones en el carrito
    fastify.put('/api/orders/details/:id', updateOrderDetail)

    // Eliminar item del carrito
    fastify.delete('/api/orders/details/:id', deleteOrderDetail)
}