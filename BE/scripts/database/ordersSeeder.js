// ordersSeeder.js - Seeder de órdenes Golden Panda

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Order from '../../src/modules/OrderModule/OrderModel.js'
import Table from '../../src/modules/TableModule/TableModel.js'

dotenv.config()

export async function seedOrders() {
    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGO_URI)
        }

        // Limpiar colección
        await Order.deleteMany()

        // Obtener mesas existentes
        const tables = await Table.find()

        if (tables.length === 0) {
            throw new Error('Se requieren mesas para crear órdenes')
        }

        const ordersData = [
            // ÓRDENES LOCALES (con mesas)
            {
                type: 'local',
                tableId: tables[0]._id, // Mesa 1
                subtotal: 25.48,
                total: 25.48,
                status: 'pendiente',
                orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Hace 2 días
                notes: 'Cliente pidió agua extra'
            },
            {
                type: 'local',
                tableId: tables[2]._id, // Mesa 3
                subtotal: 31.24,
                total: 31.24,
                status: 'preparando',
                orderDate: new Date(Date.now() - 30 * 60 * 1000), // Hace 30 minutos
                notes: 'Mesa para 4 personas'
            },
            {
                type: 'local',
                tableId: tables[5]._id, // Mesa 6
                subtotal: 18.75,
                total: 18.75,
                status: 'pendiente',
                orderDate: new Date(Date.now() - 45 * 60 * 1000), // Hace 45 minutos
                notes: 'Orden rápida'
            },

            // ÓRDENES TAKEOUT
            {
                type: 'takeout',
                customerName: 'María González',
                customerEmail: 'maria.gonzalez@email.com',
                subtotal: 42.72,
                total: 42.72,
                status: 'pendiente',
                orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Hace 1 día
                notes: 'Pedido para oficina'
            },
            {
                type: 'takeout',
                customerName: 'Carlos Rodríguez',
                customerEmail: 'carlos.rodriguez@email.com',
                subtotal: 22.49,
                total: 22.49,
                status: 'pendiente',
                orderDate: new Date(Date.now() - 10 * 60 * 1000), // Hace 10 minutos
                notes: 'Recoger en 30 minutos'
            },
            {
                type: 'takeout',
                customerName: 'Ana Martínez',
                customerEmail: 'ana.martinez@email.com',
                subtotal: 16.74,
                total: 16.74,
                status: 'preparando',
                orderDate: new Date(Date.now() - 20 * 60 * 1000), // Hace 20 minutos
                notes: 'Sin cebolla en todos los platillos'
            }
        ]

        const insertedOrders = []

        // Insertar órdenes una por una
        for (const orderData of ordersData) {
            const newOrder = new Order(orderData)
            const savedOrder = await newOrder.save()
            insertedOrders.push(savedOrder)
        }

        console.log(`✅ ${insertedOrders.length} órdenes insertadas`)

        // Estadísticas
        const localOrders = insertedOrders.filter(o => o.type === 'local').length
        const takeoutOrders = insertedOrders.filter(o => o.type === 'takeout').length

        console.log(`🏠 ${localOrders} órdenes locales | 📦 ${takeoutOrders} órdenes takeout`)

        return insertedOrders

    } catch (error) {
        console.error('❌ Error en seeder de órdenes:', error.message)
        throw error
    }
}

// Solo ejecutar directamente si es llamado como script principal
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('📋 Ejecutando seeder de órdenes...')

    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI no definida')
        process.exit(1)
    }

    try {
        await seedOrders()
        console.log('🎉 Seeder de órdenes completado')
        await mongoose.connection.close()
        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}