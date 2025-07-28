// src/repositories/OrderRepository.js
import Order from '../models/OrderModel.js'

// ============= CONSULTAS BÁSICAS =============

export const getAllOrders = async () => {
  return await Order.find()
    .populate('tableId', 'tableNumber capacity')
    .sort({ orderDate: -1 }) // Más recientes primero
}

export const getOrderByIncrementalId = async (idIncremental) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  return await Order.findOne({ idIncremental: id })
    .populate('tableId', 'tableNumber capacity')
}

export const createOrder = async (data) => {
  const newOrder = new Order(data)
  return await newOrder.save()
}

export const updateOrder = async (idIncremental, data) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  delete data.idIncremental
  return await Order.findOneAndUpdate(
    { idIncremental: id },
    data,
    { new: true }
  ).populate('tableId', 'tableNumber capacity')
}

export const deleteOrder = async (idIncremental) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  const resultado = await Order.findOneAndDelete({ idIncremental: id })
  return resultado !== null
}

// ============= CONSULTAS ESPECÍFICAS PARA HISTORIAS DE USUARIO =============

// US-012: Visualizar órdenes con tipo de pedido (para cocineros)
export const getOrdersForKitchen = async () => {
  return await Order.find({
    status: { $in: ['pendiente', 'preparando'] }
  })
    .populate('tableId', 'tableNumber')
    .sort({ orderDate: 1 }) // Más antiguos primero (FIFO)
}

// US-015 y US-016: Cambiar estado de orden (cocinero)
export const updateOrderStatus = async (idIncremental, status) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }

  const validStatuses = ['pendiente', 'preparando', 'finalizado', 'entregado', 'cancelado']
  if (!validStatuses.includes(status)) {
    throw new Error('Estado inválido')
  }

  return await Order.findOneAndUpdate(
    { idIncremental: id },
    { status },
    { new: true }
  ).populate('tableId', 'tableNumber capacity')
}

// US-023: Supervisar flujo en tiempo real (administrador)
export const getOrdersByStatus = async (status) => {
  const query = status ? { status } : {}
  return await Order.find(query)
    .populate('tableId', 'tableNumber capacity')
    .sort({ orderDate: -1 })
}

// US-021: Ver estadísticas de ventas por tipo
export const getOrdersByType = async (type) => {
  const query = type ? { type } : {}
  return await Order.find(query)
    .populate('tableId', 'tableNumber')
    .sort({ orderDate: -1 })
}

// US-022: Historial de ventas con filtros de fecha
export const getOrdersByDateRange = async (startDate, endDate) => {
  const query = {
    orderDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }
  return await Order.find(query)
    .populate('tableId', 'tableNumber capacity')
    .sort({ orderDate: -1 })
}

// Consulta por mesa específica (para pedidos locales)
export const getOrdersByTable = async (tableId) => {
  return await Order.find({ tableId })
    .populate('tableId', 'tableNumber capacity')
    .sort({ orderDate: -1 })
}

// Consulta por número de factura (para pedidos takeout)
export const getOrderByInvoiceNumber = async (invoiceNumber) => {
  return await Order.findOne({ invoiceNumber })
}

// Obtener órdenes de hoy
export const getTodayOrders = async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return await Order.find({
    orderDate: {
      $gte: today,
      $lt: tomorrow
    }
  })
    .populate('tableId', 'tableNumber capacity')
    .sort({ orderDate: -1 })
}

// Obtener estadísticas diarias
export const getDailyStats = async (date) => {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  return await Order.aggregate([
    {
      $match: {
        orderDate: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }
    },
    {
      $group: {
        _id: '$type',
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrder: { $avg: '$total' }
      }
    }
  ])
}