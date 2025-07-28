// src/modulesTransactionServices.
import * as transactionRepo from './TransactionRepository.js'
import * as orderRepo from '../OrderModule/OrderRepository.js'

// ============= CRUD BÁSICO =============

export const listTransactions = async (request, reply) => {
    try {
        const transactions = await transactionRepo.getAllTransactions()
        return transactions
    } catch (error) {
        console.error('Error listing transactions:', error)
        return reply.code(500).send({ error: 'Error retrieving transactions' })
    }
}

export const getTransaction = async (request, reply) => {
    try {
        const idIncremental = request.params.id
        const transaction = await transactionRepo.getTransactionByIncrementalId(idIncremental)
        if (!transaction) {
            return reply.code(404).send({ error: 'Transaction not found' })
        }
        return transaction
    } catch (error) {
        if (error.message === 'ID incremental inválido') {
            return reply.code(400).send({ error: 'Invalid incremental ID' })
        }
        console.error('Error getting transaction:', error)
        return reply.code(500).send({ error: 'Error retrieving transaction' })
    }
}

export const createTransaction = async (request, reply) => {
    try {
        const data = request.body

        // Validar campos obligatorios
        if (!data.orderId || !data.total || data.subtotalWithoutTax == null || !data.paymentMethod) {
            return reply.code(400).send({
                error: 'Missing required fields: orderId, total, subtotalWithoutTax, paymentMethod'
            })
        }

        // Verificar que la orden existe
        const orderExists = await orderRepo.getOrderByIncrementalId(data.orderId)
        if (!orderExists) {
            return reply.code(404).send({ error: 'Order not found' })
        }

        // Validar valores positivos
        if (data.total <= 0 || data.subtotalWithoutTax <= 0) {
            return reply.code(400).send({ error: 'Total and subtotal must be greater than 0' })
        }

        // Calcular impuesto si no se proporciona
        if (data.taxAmount == null) {
            data.taxAmount = data.total - data.subtotalWithoutTax
        }

        // Convertir orderId incremental al ObjectId real
        data.orderId = orderExists._id

        const newTransaction = await transactionRepo.createTransaction(data)

        return reply.code(201).send(newTransaction)
    } catch (error) {
        console.error('Error creating transaction:', error)
        return reply.code(500).send({ error: 'Error creating transaction' })
    }
}

export const updateTransaction = async (request, reply) => {
    try {
        const idIncremental = request.params.id
        const data = request.body

        // Validar valores si se proporcionan
        if (data.total !== undefined && data.total <= 0) {
            return reply.code(400).send({ error: 'Total must be greater than 0' })
        }

        if (data.subtotalWithoutTax !== undefined && data.subtotalWithoutTax <= 0) {
            return reply.code(400).send({ error: 'Subtotal must be greater than 0' })
        }

        const updatedTransaction = await transactionRepo.updateTransaction(idIncremental, data)
        if (!updatedTransaction) {
            return reply.code(404).send({ error: 'Transaction not found' })
        }

        return updatedTransaction
    } catch (error) {
        if (error.message === 'ID incremental inválido') {
            return reply.code(400).send({ error: 'Invalid incremental ID' })
        }
        console.error('Error updating transaction:', error)
        return reply.code(500).send({ error: 'Error updating transaction' })
    }
}

export const deleteTransaction = async (request, reply) => {
    try {
        const idIncremental = request.params.id
        const deleted = await transactionRepo.deleteTransaction(idIncremental)
        if (!deleted) {
            return reply.code(404).send({ error: 'Transaction not found' })
        }
        return reply.code(200).send({
            message: 'Transaction deleted successfully',
            id: parseInt(idIncremental)
        })
    } catch (error) {
        if (error.message === 'ID incremental inválido') {
            return reply.code(400).send({ error: 'Invalid incremental ID' })
        }
        console.error('Error deleting transaction:', error)
        return reply.code(500).send({ error: 'Error deleting transaction' })
    }
}

// ============= FUNCIONES ESPECÍFICAS PARA HISTORIAS DE USUARIO =============

// US-009: Pago en línea - procesar pago
export const processPayment = async (request, reply) => {
    try {
        const { orderId, paymentMethod, transactionId } = request.body

        if (!orderId || !paymentMethod) {
            return reply.code(400).send({
                error: 'orderId and paymentMethod are required'
            })
        }

        // Obtener la orden para calcular totales
        const order = await orderRepo.getOrderByIncrementalId(orderId)
        if (!order) {
            return reply.code(404).send({ error: 'Order not found' })
        }

        // Verificar si ya existe una transacción para esta orden
        const existingTransaction = await transactionRepo.getTransactionByOrderId(order._id)
        if (existingTransaction) {
            return reply.code(409).send({ error: 'Transaction already exists for this order' })
        }

        // Calcular impuesto (ejemplo: 7% ITBMS en Panamá)
        const taxRate = 0.07
        const subtotalWithoutTax = order.total / (1 + taxRate)
        const taxAmount = order.total - subtotalWithoutTax

        const transactionData = {
            orderId: order._id,
            total: order.total,
            subtotalWithoutTax: Math.round(subtotalWithoutTax * 100) / 100,
            taxAmount: Math.round(taxAmount * 100) / 100,
            paymentMethod,
            transactionId: transactionId || `TXN-${Date.now()}`,
            status: 'pagada',
            paymentStatus: 'exitoso'
        }

        const newTransaction = await transactionRepo.createTransaction(transactionData)

        return reply.code(201).send({
            message: 'Payment processed successfully',
            transaction: newTransaction
        })
    } catch (error) {
        console.error('Error processing payment:', error)
        return reply.code(500).send({ error: 'Error processing payment' })
    }
}

// US-010: Confirmación de pedido - verificar estado de pago
export const getPaymentStatus = async (request, reply) => {
    try {
        const orderId = request.params.orderId

        if (!orderId) {
            return reply.code(400).send({ error: 'Order ID is required' })
        }

        // Obtener la orden para convertir ID incremental
        const order = await orderRepo.getOrderByIncrementalId(orderId)
        if (!order) {
            return reply.code(404).send({ error: 'Order not found' })
        }

        const transactionStatus = await transactionRepo.getTransactionStatus(order._id)

        if (!transactionStatus) {
            return reply.code(404).send({ error: 'No payment found for this order' })
        }

        return {
            orderId: parseInt(orderId),
            paymentStatus: transactionStatus.paymentStatus,
            status: transactionStatus.status,
            paymentDate: transactionStatus.paymentDate,
            total: transactionStatus.total,
            transactionId: transactionStatus.transactionId
        }
    } catch (error) {
        console.error('Error getting payment status:', error)
        return reply.code(500).send({ error: 'Error retrieving payment status' })
    }
}

// US-021 y US-022: Estadísticas de ventas
export const getSalesStats = async (request, reply) => {
    try {
        const { startDate, endDate } = request.query

        if (!startDate || !endDate) {
            return reply.code(400).send({
                error: 'startDate and endDate query parameters are required'
            })
        }

        const revenue = await transactionRepo.getRevenueByPeriod(startDate, endDate)
        const dailyStats = await transactionRepo.getDailyTransactionStats(startDate)
        const paymentMethodStats = await transactionRepo.getTransactionsByPaymentMethod()

        return {
            period: {
                startDate,
                endDate
            },
            revenue,
            dailyBreakdown: dailyStats,
            paymentMethods: paymentMethodStats
        }
    } catch (error) {
        console.error('Error getting sales stats:', error)
        return reply.code(500).send({ error: 'Error retrieving sales statistics' })
    }
}

// Obtener transacciones de hoy para dashboard
export const getTodayTransactions = async (request, reply) => {
    try {
        const transactions = await transactionRepo.getTodayTransactions()
        return transactions
    } catch (error) {
        console.error('Error getting today transactions:', error)
        return reply.code(500).send({ error: 'Error retrieving today transactions' })
    }
}

// Historial de transacciones con filtros
export const getTransactionHistory = async (request, reply) => {
    try {
        const { startDate, endDate } = request.query

        if (!startDate || !endDate) {
            return reply.code(400).send({
                error: 'startDate and endDate query parameters are required'
            })
        }

        const transactions = await transactionRepo.getTransactionsByDateRange(startDate, endDate)

        return {
            period: {
                startDate,
                endDate
            },
            transactions,
            count: transactions.length
        }
    } catch (error) {
        console.error('Error getting transaction history:', error)
        return reply.code(500).send({ error: 'Error retrieving transaction history' })
    }
}

// Obtener transacciones fallidas para análisis
export const getFailedTransactions = async (request, reply) => {
    try {
        const failedTransactions = await transactionRepo.getFailedTransactions()

        return {
            count: failedTransactions.length,
            transactions: failedTransactions
        }
    } catch (error) {
        console.error('Error getting failed transactions:', error)
        return reply.code(500).send({ error: 'Error retrieving failed transactions' })
    }
}

// Webhook para actualizar estado de transacción (desde pasarela de pago)
export const updatePaymentStatus = async (request, reply) => {
    try {
        const { transactionId, status, paymentStatus } = request.body

        if (!transactionId || !status || !paymentStatus) {
            return reply.code(400).send({
                error: 'transactionId, status, and paymentStatus are required'
            })
        }

        const updatedTransaction = await transactionRepo.updateTransactionStatus(
            transactionId,
            status,
            paymentStatus
        )

        if (!updatedTransaction) {
            return reply.code(404).send({ error: 'Transaction not found' })
        }

        return reply.code(200).send({
            message: 'Transaction status updated successfully',
            transaction: updatedTransaction
        })
    } catch (error) {
        if (error.message.includes('inválido')) {
            return reply.code(400).send({ error: error.message })
        }
        console.error('Error updating payment status:', error)
        return reply.code(500).send({ error: 'Error updating payment status' })
    }
}