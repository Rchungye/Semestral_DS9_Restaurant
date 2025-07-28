// ============= src/repositories/TransactionRepository.js =============
import Transaction from '../models/TransactionModel.js'

// ============= CONSULTAS BÁSICAS =============

export const getAllTransactions = async () => {
    return await Transaction.find()
        .populate('orderId', 'idIncremental orderDate type status customerName invoiceNumber tableId')
        .sort({ createdAt: -1 })
}

export const getTransactionByIncrementalId = async (idIncremental) => {
    const id = parseInt(idIncremental)
    if (isNaN(id) || id <= 0) {
        throw new Error('ID incremental inválido')
    }
    return await Transaction.findOne({ idIncremental: id })
        .populate('orderId', 'idIncremental orderDate type status customerName invoiceNumber tableId')
}

export const createTransaction = async (data) => {
    const newTransaction = new Transaction(data)
    return await newTransaction.save()
}

export const updateTransaction = async (idIncremental, data) => {
    const id = parseInt(idIncremental)
    if (isNaN(id) || id <= 0) {
        throw new Error('ID incremental inválido')
    }
    delete data.idIncremental
    return await Transaction.findOneAndUpdate(
        { idIncremental: id },
        data,
        { new: true }
    )
        .populate('orderId', 'idIncremental orderDate type status customerName invoiceNumber')
}

export const deleteTransaction = async (idIncremental) => {
    const id = parseInt(idIncremental)
    if (isNaN(id) || id <= 0) {
        throw new Error('ID incremental inválido')
    }
    const resultado = await Transaction.findOneAndDelete({ idIncremental: id })
    return resultado !== null
}

// ============= CONSULTAS ESPECÍFICAS PARA HISTORIAS DE USUARIO =============

// US-009: Pago en línea - obtener transacción por orden
export const getTransactionByOrderId = async (orderId) => {
    return await Transaction.findOne({ orderId })
        .populate('orderId', 'idIncremental orderDate type status customerName invoiceNumber')
}

// US-010: Confirmación de pedido - verificar estado de pago
export const getTransactionStatus = async (orderId) => {
    return await Transaction.findOne({ orderId })
        .select('status paymentStatus paymentDate total transactionId')
}

// US-021: Estadísticas de ventas - transacciones exitosas
export const getSuccessfulTransactions = async () => {
    return await Transaction.find({
        status: 'pagada',
        paymentStatus: 'exitoso'
    })
        .populate('orderId', 'idIncremental orderDate type customerName')
        .sort({ saleDate: -1 })
}

// US-022: Historial de ventas con filtros de fecha
export const getTransactionsByDateRange = async (startDate, endDate) => {
    const query = {
        saleDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        },
        status: 'pagada',
        paymentStatus: 'exitoso'
    }
    return await Transaction.find(query)
        .populate('orderId', 'idIncremental orderDate type customerName invoiceNumber')
        .sort({ saleDate: -1 })
}

// Obtener transacciones de hoy
export const getTodayTransactions = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return await Transaction.find({
        saleDate: {
            $gte: today,
            $lt: tomorrow
        },
        status: 'pagada',
        paymentStatus: 'exitoso'
    })
        .populate('orderId', 'idIncremental orderDate type customerName invoiceNumber')
        .sort({ saleDate: -1 })
}

// Estadísticas diarias de transacciones
export const getDailyTransactionStats = async (date) => {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return await Transaction.aggregate([
        {
            $match: {
                saleDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                },
                status: 'pagada',
                paymentStatus: 'exitoso'
            }
        },
        {
            $lookup: {
                from: 'orders',
                localField: 'orderId',
                foreignField: '_id',
                as: 'orderInfo'
            }
        },
        {
            $unwind: '$orderInfo'
        },
        {
            $group: {
                _id: '$orderInfo.type',
                totalTransactions: { $sum: 1 },
                totalRevenue: { $sum: '$total' },
                averageTransaction: { $avg: '$total' },
                totalTaxes: { $sum: '$taxAmount' }
            }
        }
    ])
}

// Transacciones por método de pago
export const getTransactionsByPaymentMethod = async () => {
    return await Transaction.aggregate([
        {
            $match: {
                status: 'pagada',
                paymentStatus: 'exitoso'
            }
        },
        {
            $group: {
                _id: '$paymentMethod',
                totalTransactions: { $sum: 1 },
                totalRevenue: { $sum: '$total' },
                averageTransaction: { $avg: '$total' }
            }
        },
        {
            $sort: { totalRevenue: -1 }
        }
    ])
}

// Transacciones fallidas para análisis
export const getFailedTransactions = async () => {
    return await Transaction.find({
        $or: [
            { status: 'cancelada' },
            { paymentStatus: 'fallido' }
        ]
    })
        .populate('orderId', 'idIncremental orderDate type customerName')
        .sort({ createdAt: -1 })
}

// Actualizar estado de transacción (para webhooks de pago)
export const updateTransactionStatus = async (transactionId, status, paymentStatus) => {
    const validStatuses = ['pendiente', 'pagada', 'cancelada']
    const validPaymentStatuses = ['exitoso', 'fallido', 'pendiente']

    if (!validStatuses.includes(status)) {
        throw new Error('Estado de transacción inválido')
    }

    if (!validPaymentStatuses.includes(paymentStatus)) {
        throw new Error('Estado de pago inválido')
    }

    return await Transaction.findOneAndUpdate(
        { transactionId },
        {
            status,
            paymentStatus,
            paymentDate: paymentStatus === 'exitoso' ? new Date() : undefined
        },
        { new: true }
    )
}

// Calcular ingresos por período
export const getRevenueByPeriod = async (startDate, endDate) => {
    const result = await Transaction.aggregate([
        {
            $match: {
                saleDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
                status: 'pagada',
                paymentStatus: 'exitoso'
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$total' },
                totalTaxes: { $sum: '$taxAmount' },
                totalTransactions: { $sum: 1 },
                averageTransaction: { $avg: '$total' }
            }
        }
    ])

    return result.length > 0 ? result[0] : {
        totalRevenue: 0,
        totalTaxes: 0,
        totalTransactions: 0,
        averageTransaction: 0
    }
}