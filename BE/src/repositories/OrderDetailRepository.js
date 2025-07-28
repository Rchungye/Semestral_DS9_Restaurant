// ============= src/repositories/OrderDetailRepository.js =============
import OrderDetail from '../models/OrderDetailModel.js'

// ============= CONSULTAS BÁSICAS =============

export const getAllOrderDetails = async () => {
    return await OrderDetail.find()
        .populate('orderId', 'idIncremental orderDate type status')
        .populate('dishId', 'name price category photo')
        .sort({ createdAt: -1 })
}

export const getOrderDetailByIncrementalId = async (idIncremental) => {
    const id = parseInt(idIncremental)
    if (isNaN(id) || id <= 0) {
        throw new Error('ID incremental inválido')
    }
    return await OrderDetail.findOne({ idIncremental: id })
        .populate('orderId', 'idIncremental orderDate type status')
        .populate('dishId', 'name price category photo description')
}

export const createOrderDetail = async (data) => {
    const newOrderDetail = new OrderDetail(data)
    return await newOrderDetail.save()
}

export const updateOrderDetail = async (idIncremental, data) => {
    const id = parseInt(idIncremental)
    if (isNaN(id) || id <= 0) {
        throw new Error('ID incremental inválido')
    }
    delete data.idIncremental

    // Recalcular subtotal si se cambia quantity o unitPrice
    if (data.quantity || data.unitPrice) {
        const currentDetail = await OrderDetail.findOne({ idIncremental: id })
        if (currentDetail) {
            const quantity = data.quantity || currentDetail.quantity
            const unitPrice = data.unitPrice || currentDetail.unitPrice
            data.subtotal = quantity * unitPrice
        }
    }

    return await OrderDetail.findOneAndUpdate(
        { idIncremental: id },
        data,
        { new: true }
    )
        .populate('orderId', 'idIncremental orderDate type status')
        .populate('dishId', 'name price category photo')
}

export const deleteOrderDetail = async (idIncremental) => {
    const id = parseInt(idIncremental)
    if (isNaN(id) || id <= 0) {
        throw new Error('ID incremental inválido')
    }
    const resultado = await OrderDetail.findOneAndDelete({ idIncremental: id })
    return resultado !== null
}

// ============= CONSULTAS ESPECÍFICAS PARA HISTORIAS DE USUARIO =============

// US-017: Ver personalizaciones del platillo para cocineros
export const getOrderDetailsByOrderId = async (orderId) => {
    return await OrderDetail.find({ orderId })
        .populate('dishId', 'name price category photo description')
        .sort({ createdAt: 1 }) // Orden de creación
}

// US-006: Carrito de pedidos - obtener detalles para mostrar al cliente
export const getOrderDetailsForCart = async (orderId) => {
    return await OrderDetail.find({ orderId })
        .populate('dishId', 'name price photo category')
        .select('quantity unitPrice subtotal accompaniments preparationType specialInstructions')
}

// Crear múltiples detalles de orden (para cuando se crea un pedido completo)
export const createMultipleOrderDetails = async (orderDetailsArray) => {
    return await OrderDetail.insertMany(orderDetailsArray)
}

// Obtener detalles por platillo específico (para análisis de ventas)
export const getOrderDetailsByDishId = async (dishId) => {
    return await OrderDetail.find({ dishId })
        .populate('orderId', 'idIncremental orderDate type status')
        .sort({ createdAt: -1 })
}

// Obtener estadísticas de platillos más vendidos
export const getMostOrderedDishes = async (limit = 10) => {
    return await OrderDetail.aggregate([
        {
            $group: {
                _id: '$dishId',
                totalQuantity: { $sum: '$quantity' },
                totalRevenue: { $sum: '$subtotal' },
                orderCount: { $sum: 1 },
                averagePrice: { $avg: '$unitPrice' }
            }
        },
        {
            $lookup: {
                from: 'dishes',
                localField: '_id',
                foreignField: '_id',
                as: 'dishInfo'
            }
        },
        {
            $unwind: '$dishInfo'
        },
        {
            $project: {
                dishName: '$dishInfo.name',
                dishCategory: '$dishInfo.category',
                totalQuantity: 1,
                totalRevenue: 1,
                orderCount: 1,
                averagePrice: 1
            }
        },
        {
            $sort: { totalQuantity: -1 }
        },
        {
            $limit: limit
        }
    ])
}

// Obtener detalles con personalizaciones especiales para cocina
export const getOrderDetailsWithCustomizations = async (orderId) => {
    return await OrderDetail.find({
        orderId,
        $or: [
            { accompaniments: { $ne: null, $ne: '' } },
            { preparationType: { $ne: null, $ne: '' } },
            { specialInstructions: { $ne: null, $ne: '' } }
        ]
    })
        .populate('dishId', 'name category')
        .select('quantity accompaniments preparationType specialInstructions dishId')
}

// Calcular total de una orden basado en sus detalles
export const calculateOrderTotal = async (orderId) => {
    const result = await OrderDetail.aggregate([
        {
            $match: { orderId: orderId }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: '$subtotal' },
                totalItems: { $sum: '$quantity' },
                itemCount: { $sum: 1 }
            }
        }
    ])

    return result.length > 0 ? result[0] : { totalAmount: 0, totalItems: 0, itemCount: 0 }
}