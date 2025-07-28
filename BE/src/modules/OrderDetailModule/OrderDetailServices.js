// src/modules/OrderDetailModule/OrderDetailServices.js
import * as orderDetailRepo from './OrderDetailRepository.js'
import * as orderRepo from '../OrderModule/OrderRepository.js'
import * as dishRepo from '../DishModule/DishRepository.js'

// ============= CRUD BÁSICO =============

export const listOrderDetails = async (request, reply) => {
    try {
        const orderDetails = await orderDetailRepo.getAllOrderDetails()
        return orderDetails
    } catch (error) {
        console.error('Error listing order details:', error)
        return reply.code(500).send({ error: 'Error retrieving order details' })
    }
}

export const getOrderDetail = async (request, reply) => {
    try {
        const idIncremental = request.params.id
        const orderDetail = await orderDetailRepo.getOrderDetailByIncrementalId(idIncremental)
        if (!orderDetail) {
            return reply.code(404).send({ error: 'Order detail not found' })
        }
        return orderDetail
    } catch (error) {
        if (error.message === 'ID incremental inválido') {
            return reply.code(400).send({ error: 'Invalid incremental ID' })
        }
        console.error('Error getting order detail:', error)
        return reply.code(500).send({ error: 'Error retrieving order detail' })
    }
}

export const createOrderDetail = async (request, reply) => {
    try {
        const data = request.body

        // Validar campos obligatorios
        if (!data.orderId || !data.dishId || !data.quantity || data.unitPrice == null) {
            return reply.code(400).send({
                error: 'Missing required fields: orderId, dishId, quantity, unitPrice'
            })
        }

        // Verificar que la orden existe
        const orderExists = await orderRepo.getOrderByIncrementalId(data.orderId)
        if (!orderExists) {
            return reply.code(404).send({ error: 'Order not found' })
        }

        // Verificar que el platillo existe
        const dishExists = await dishRepo.getDishByIncrementalId(data.dishId)
        if (!dishExists) {
            return reply.code(404).send({ error: 'Dish not found' })
        }

        // Validar quantity positiva
        if (data.quantity <= 0) {
            return reply.code(400).send({ error: 'Quantity must be greater than 0' })
        }

        const newOrderDetail = await orderDetailRepo.createOrderDetail(data)

        return reply.code(201).send(newOrderDetail)
    } catch (error) {
        console.error('Error creating order detail:', error)
        return reply.code(500).send({ error: 'Error creating order detail' })
    }
}

export const updateOrderDetail = async (request, reply) => {
    try {
        const idIncremental = request.params.id
        const data = request.body

        // Validar quantity si se proporciona
        if (data.quantity !== undefined && data.quantity <= 0) {
            return reply.code(400).send({ error: 'Quantity must be greater than 0' })
        }

        const updatedOrderDetail = await orderDetailRepo.updateOrderDetail(idIncremental, data)
        if (!updatedOrderDetail) {
            return reply.code(404).send({ error: 'Order detail not found' })
        }

        return updatedOrderDetail
    } catch (error) {
        if (error.message === 'ID incremental inválido') {
            return reply.code(400).send({ error: 'Invalid incremental ID' })
        }
        console.error('Error updating order detail:', error)
        return reply.code(500).send({ error: 'Error updating order detail' })
    }
}

export const deleteOrderDetail = async (request, reply) => {
    try {
        const idIncremental = request.params.id
        const deleted = await orderDetailRepo.deleteOrderDetail(idIncremental)
        if (!deleted) {
            return reply.code(404).send({ error: 'Order detail not found' })
        }
        return reply.code(200).send({
            message: 'Order detail deleted successfully',
            id: parseInt(idIncremental)
        })
    } catch (error) {
        if (error.message === 'ID incremental inválido') {
            return reply.code(400).send({ error: 'Invalid incremental ID' })
        }
        console.error('Error deleting order detail:', error)
        return reply.code(500).send({ error: 'Error deleting order detail' })
    }
}

// ============= FUNCIONES ESPECÍFICAS PARA HISTORIAS DE USUARIO =============

// US-017: Ver personalizaciones del platillo para cocineros
export const getOrderDetailsForKitchen = async (request, reply) => {
    try {
        const orderId = request.params.orderId

        if (!orderId) {
            return reply.code(400).send({ error: 'Order ID is required' })
        }

        const orderDetails = await orderDetailRepo.getOrderDetailsByOrderId(orderId)

        if (!orderDetails || orderDetails.length === 0) {
            return reply.code(404).send({ error: 'No order details found for this order' })
        }

        return orderDetails
    } catch (error) {
        console.error('Error getting order details for kitchen:', error)
        return reply.code(500).send({ error: 'Error retrieving order details for kitchen' })
    }
}

// US-006: Obtener detalles del carrito
export const getCartDetails = async (request, reply) => {
    try {
        const orderId = request.params.orderId

        const cartDetails = await orderDetailRepo.getOrderDetailsForCart(orderId)

        // Calcular totales
        const totals = await orderDetailRepo.calculateOrderTotal(orderId)

        return {
            items: cartDetails,
            summary: {
                totalItems: totals.totalItems,
                itemCount: totals.itemCount,
                totalAmount: totals.totalAmount
            }
        }
    } catch (error) {
        console.error('Error getting cart details:', error)
        return reply.code(500).send({ error: 'Error retrieving cart details' })
    }
}

// Crear múltiples detalles de orden (útil para pedidos completos)
export const createMultipleOrderDetails = async (request, reply) => {
    try {
        const { orderId, items } = request.body

        if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
            return reply.code(400).send({
                error: 'orderId and items array are required'
            })
        }

        // Preparar datos para inserción múltiple
        const orderDetailsData = items.map(item => ({
            orderId,
            dishId: item.dishId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            accompaniments: item.accompaniments || '',
            preparationType: item.preparationType || '',
            specialInstructions: item.specialInstructions || ''
        }))

        const createdDetails = await orderDetailRepo.createMultipleOrderDetails(orderDetailsData)

        return reply.code(201).send({
            message: 'Order details created successfully',
            count: createdDetails.length,
            details: createdDetails
        })
    } catch (error) {
        console.error('Error creating multiple order details:', error)
        return reply.code(500).send({ error: 'Error creating multiple order details' })
    }
}

// Estadísticas de platillos más vendidos
export const getMostOrderedDishes = async (request, reply) => {
    try {
        const limit = parseInt(request.query.limit) || 10
        const stats = await orderDetailRepo.getMostOrderedDishes(limit)

        return {
            message: 'Most ordered dishes statistics',
            data: stats
        }
    } catch (error) {
        console.error('Error getting most ordered dishes:', error)
        return reply.code(500).send({ error: 'Error retrieving dish statistics' })
    }
}

// Obtener personalizaciones para cocina
export const getCustomizationsForKitchen = async (request, reply) => {
    try {
        const orderId = request.params.orderId
        const customizations = await orderDetailRepo.getOrderDetailsWithCustomizations(orderId)

        return {
            orderId,
            customizations
        }
    } catch (error) {
        console.error('Error getting customizations:', error)
        return reply.code(500).send({ error: 'Error retrieving customizations' })
    }
}