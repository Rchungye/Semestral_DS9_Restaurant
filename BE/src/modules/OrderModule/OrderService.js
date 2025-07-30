// src/modules/OrderServices.js
import * as orderRepo from './OrderRepository.js'
import * as tableRepo from '../TableModule/TableRepository.js'
import * as orderDetailRepo from '../OrderDetailModule/OrderDetailRepository.js'

// ============= CRUD BÁSICO =============

export const listOrders = async (request, reply) => {
  try {
    const orders = await orderRepo.getAllOrders()
    return orders
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving orders' })
  }
}

export const getOrder = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const order = await orderRepo.getOrderByIncrementalId(idIncremental)
    if (!order) {
      return reply.code(404).send({ error: 'Order not found' })
    }
    return order
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    return reply.code(500).send({ error: 'Error retrieving order' })
  }
}

export const createOrder = async (request, reply) => {
  try {
    const data = request.body;
    console.log('Pedido recibido en backend:', data);
    // Solo validar subtotal y total
    if (!data.subtotal || !data.total) {
      return reply.code(400).send({
        error: 'Missing required fields: subtotal, total'
      });
    }
    // Si no se envía type, asumir 'local' por default
    if (!data.type) {
      data.type = 'local';
    }
    // Si es local y se recibe tableNumber, buscar la mesa y asociar su ObjectId
    if (data.type === 'local' && data.tableNumber) {
      const mesa = await tableRepo.getTableByNumber(data.tableNumber);
      if (mesa) {
        data.tableId = mesa._id;
      } else {
        console.warn('No se encontró la mesa con número:', data.tableNumber);
      }
      // No guardar tableNumber en el modelo, solo tableId
      delete data.tableNumber;
    }
    // Crear el pedido principal
    const newOrder = await orderRepo.createOrder(data);
    // Crear detalles de pedido si vienen en la petición
    if (data.cartItems && Array.isArray(data.cartItems)) {
      console.log('cartItems recibidos:', data.cartItems);
      for (const item of data.cartItems) {
        const detailPayload = {
          orderId: newOrder._id,
          dishId: item._id, // Asegúrate que el frontend envía _id del platillo
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: item.price * item.quantity,
        };
        console.log('Creando OrderDetail:', detailPayload);
        const createdDetail = await orderDetailRepo.createOrderDetail(detailPayload);
        console.log('OrderDetail creado:', createdDetail);
      }
    } else {
      console.log('No se recibieron cartItems o no es un array');
    }
    return reply.code(201).send(newOrder);
  } catch (error) {
    console.error('Create order error:', error);
    return reply.code(500).send({ error: 'Error creating order' });
  }
}

export const updateOrder = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const data = request.body
    
    const updatedOrder = await orderRepo.updateOrder(idIncremental, data)
    if (!updatedOrder) {
      return reply.code(404).send({ error: 'Order not found' })
    }
    return updatedOrder
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    return reply.code(500).send({ error: 'Error updating order' })
  }
}

export const deleteOrder = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const deleted = await orderRepo.deleteOrder(idIncremental)
    if (!deleted) {
      return reply.code(404).send({ error: 'Order not found' })
    }
    return reply.code(200).send({ 
      message: 'Order deleted successfully',
      id: parseInt(idIncremental)
    })
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    return reply.code(500).send({ error: 'Error deleting order' })
  }
}

// ============= FUNCIONES ESPECÍFICAS PARA HISTORIAS DE USUARIO =============

// US-012: Órdenes para cocina (cocineros)
export const getKitchenOrders = async (request, reply) => {
  try {
    const orders = await orderRepo.getOrdersForKitchen()
    return orders
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving kitchen orders' })
  }
}

// US-015 y US-016: Cambiar estado de orden (cocineros)
export const updateOrderStatus = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const { status } = request.body
    
    if (!status) {
      return reply.code(400).send({ error: 'Status is required' })
    }
    
    const updatedOrder = await orderRepo.updateOrderStatus(idIncremental, status)
    if (!updatedOrder) {
      return reply.code(404).send({ error: 'Order not found' })
    }
    
    return reply.code(200).send({
      message: `Order status updated to ${status}`,
      order: updatedOrder
    })
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    if (error.message === 'Estado inválido') {
      return reply.code(400).send({ error: 'Invalid status' })
    }
    return reply.code(500).send({ error: 'Error updating order status' })
  }
}

// US-023: Supervisar flujo en tiempo real (administrador)
export const getOrdersByStatus = async (request, reply) => {
  try {
    const status = request.query.status
    const orders = await orderRepo.getOrdersByStatus(status)
    return orders
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving orders by status' })
  }
}

// US-021: Órdenes por tipo (local/takeout)
export const getOrdersByType = async (request, reply) => {
  try {
    const type = request.params.type
    
    if (type && !['local', 'takeout'].includes(type)) {
      return reply.code(400).send({ error: 'Invalid order type' })
    }
    
    const orders = await orderRepo.getOrdersByType(type)
    return orders
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving orders by type' })
  }
}

// Obtener órdenes de hoy
export const getTodayOrders = async (request, reply) => {
  try {
    const orders = await orderRepo.getTodayOrders()
    return orders
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving today orders' })
  }
}

// Estadísticas diarias
export const getDailyStats = async (request, reply) => {
  try {
    const date = request.query.date || new Date().toISOString().split('T')[0]
    const stats = await orderRepo.getDailyStats(date)
    
    // Formatear respuesta para mejor comprensión
    const formattedStats = {
      date,
      summary: stats.reduce((acc, stat) => {
        acc[stat._id] = {
          totalOrders: stat.totalOrders,
          totalRevenue: stat.totalRevenue,
          averageOrder: Math.round(stat.averageOrder * 100) / 100
        }
        return acc
      }, {}),
      totals: {
        totalOrders: stats.reduce((sum, stat) => sum + stat.totalOrders, 0),
        totalRevenue: stats.reduce((sum, stat) => sum + stat.totalRevenue, 0)
      }
    }
    
    return formattedStats
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving daily stats' })
  }
}

// Buscar orden por número de factura (takeout)
export const getOrderByInvoice = async (request, reply) => {
  try {
    const invoiceNumber = request.params.invoice
    const order = await orderRepo.getOrderByInvoiceNumber(invoiceNumber)
    if (!order) {
      return reply.code(404).send({ error: 'Order not found with this invoice number' })
    }
    return order
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving order by invoice' })
  }
}