// src/modules/TransactionRoutes.
import {
    listTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    processPayment,
    getPaymentStatus,
    getSalesStats,
    getTodayTransactions,
    getTransactionHistory,
    getFailedTransactions,
    updatePaymentStatus
} from './TransactionService.js'

import { verificarAdmin } from '../../common/middleware/AuthMiddleware.js'

// Rutas de administrador
export function transactionAdminRoutes(fastify) {
    fastify.get('/api/admin/transactions', { preHandler: verificarAdmin }, listTransactions)
    fastify.get('/api/admin/transactions/:id', { preHandler: verificarAdmin }, getTransaction)
    fastify.post('/api/admin/transactions', { preHandler: verificarAdmin }, createTransaction)
    fastify.put('/api/admin/transactions/:id', { preHandler: verificarAdmin }, updateTransaction)
    fastify.delete('/api/admin/transactions/:id', { preHandler: verificarAdmin }, deleteTransaction)

    // ============= ENDPOINTS PARA ADMINISTRADORES - ANÁLISIS =============
    // US-021: Estadísticas de ventas diarias
    fastify.get('/api/admin/sales/stats', { preHandler: verificarAdmin }, getSalesStats)
    // US-022: Historial de ventas con filtros de fecha
    fastify.get('/api/admin/sales/history', { preHandler: verificarAdmin }, getTransactionHistory)
    // Transacciones de hoy para dashboard
    fastify.get('/api/admin/transactions/today', { preHandler: verificarAdmin }, getTodayTransactions)
    // Análisis de transacciones fallidas
    fastify.get('/api/admin/transactions/failed', { preHandler: verificarAdmin }, getFailedTransactions)

    // ============= ENDPOINTS PARA REPORTES =============
    // Endpoint adicional para obtener resumen financiero del día (dashboard)
    fastify.get('/api/admin/financial/summary', { preHandler: verificarAdmin }, async (request, reply) => {
        try {
            const today = new Date().toISOString().split('T')[0]
            const salesStats = await getSalesStats({
                query: {
                    startDate: today,
                    endDate: today
                }
            }, reply)

            const todayTransactions = await getTodayTransactions(request, reply)

            return {
                date: today,
                summary: salesStats,
                recentTransactions: todayTransactions?.slice(0, 10) || []
            }
        } catch (error) {
            return reply.code(500).send({ error: 'Error retrieving financial summary' })
        }
    })

}

// Rutas públicas
export function transactionPublicRoutes(fastify) {
    // ============= ENDPOINTS PÚBLICOS PARA CLIENTES =============
    // US-009: Pago en línea - procesar pago del pedido
    fastify.post('/api/payments/process', processPayment)
    // US-010: Confirmación de pedido - verificar estado de pago
    fastify.get('/api/payments/status/:orderId', getPaymentStatus)

    // ============= WEBHOOKS Y ENDPOINTS EXTERNOS =============
    // Webhook para recibir actualizaciones de estado desde pasarela de pago
    // Nota: Este endpoint no requiere autenticación ya que viene de servicios externos
    // Se debe implementar validación de firma/token de la pasarela en producción
    fastify.post('/api/webhooks/payment-status', updatePaymentStatus)

}

// Exportación por defecto (todas las rutas juntas)
export default function (fastify) {
    transactionAdminRoutes(fastify)
    transactionPublicRoutes(fastify)
}