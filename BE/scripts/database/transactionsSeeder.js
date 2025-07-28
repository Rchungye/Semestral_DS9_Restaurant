
// transactionsSeeder.js - Seeder de transacciones Golden Panda

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Transaction from '../../src/modules/TransactionModule/TransactionModel.js'
import Order from '../../src/modules/OrderModule/OrderModel.js'

dotenv.config()

export async function seedTransactions() {
    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGO_URI)
        }

        // Limpiar colección
        await Transaction.deleteMany()

        // Obtener órdenes existentes
        const orders = await Order.find().sort({ idIncremental: 1 })

        if (orders.length === 0) {
            throw new Error('Se requieren órdenes para crear transacciones')
        }

        const insertedTransactions = []

        // Crear transacciones solo para órdenes entregadas
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i]

            // Solo crear transacciones para órdenes entregadas
            if (order.status === 'entregado') {
                const transactionData = {
                    orderId: order._id,
                    total: order.total,
                    subtotalWithoutTax: order.total, // Sin impuestos como solicitaste
                    taxAmount: 0, // Sin impuestos
                    paymentMethod: 'tarjeta',
                    status: 'pagada',
                    paymentStatus: 'exitoso',
                    transactionId: `TXN-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 6)}`,
                    saleDate: order.orderDate,
                    paymentDate: new Date(order.orderDate.getTime() + 5 * 60 * 1000) // 5 min después del pedido
                }

                const transaction = new Transaction(transactionData)
                const savedTransaction = await transaction.save()
                insertedTransactions.push(savedTransaction)
            }
        }

        console.log(`✅ ${insertedTransactions.length} transacciones insertadas`)

        // Estadísticas
        const totalRevenue = insertedTransactions.reduce((sum, t) => sum + t.total, 0)
        const totalOrders = orders.length
        const paidOrders = insertedTransactions.length

        console.log(`💳 ${paidOrders}/${totalOrders} órdenes pagadas`)
        console.log(`💰 Ingresos totales: $${totalRevenue.toFixed(2)}`)
        console.log(`📊 Promedio por transacción: $${paidOrders > 0 ? (totalRevenue / paidOrders).toFixed(2) : '0.00'}`)

        return insertedTransactions

    } catch (error) {
        console.error('❌ Error en seeder de transacciones:', error.message)
        throw error
    }
}

// Solo ejecutar directamente si es llamado como script principal
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('💳 Ejecutando seeder de transacciones...')

    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI no definida')
        process.exit(1)
    }

    try {
        await seedTransactions()
        console.log('🎉 Seeder de transacciones completado')
        await mongoose.connection.close()
        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}