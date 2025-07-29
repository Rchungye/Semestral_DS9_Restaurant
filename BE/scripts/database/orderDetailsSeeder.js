// orderDetailsSeeder.js - Seeder de detalles de órdenes Golden Panda

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import OrderDetail from '../../src/modules/OrderDetailModule/OrderDetailModel.js'
import Order from '../../src/modules/OrderModule/OrderModel.js'
import Dish from '../../src/modules/DishModule/DishModel.js'

dotenv.config()

export async function seedOrderDetails() {
    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGO_URI)
        }

        // Limpiar colección
        await OrderDetail.deleteMany()

        // Obtener datos existentes
        const orders = await Order.find().sort({ idIncremental: 1 })
        const dishes = await Dish.find().sort({ idIncremental: 1 })

        if (orders.length === 0 || dishes.length === 0) {
            throw new Error('Se requieren órdenes y platillos para crear detalles')
        }

        // Definir detalles para cada orden
        const orderDetailsData = [
            // Orden 1 (Local - Mesa 1)
            [
                { dishIndex: 0, quantity: 2, specialInstructions: 'Extra picante' }, // Siu Mai
                { dishIndex: 4, quantity: 1 }, // Pato Laqueado
                { dishIndex: 8, quantity: 2 } // Té Verde Jasmine
            ],
            // Orden 2 (Local - Mesa 3)
            [
                { dishIndex: 1, quantity: 1 }, // Hakao
                { dishIndex: 5, quantity: 2 }, // Chow Mein
                { dishIndex: 10, quantity: 3 } // Arroz Blanco
            ],
            // Orden 3 (Local - Mesa 6)
            [
                { dishIndex: 2, quantity: 2 }, // Rollitos Primavera
                { dishIndex: 6, quantity: 1, specialInstructions: 'Sin cebolla' }, // Arroz Frito Golden Panda
                { dishIndex: 9, quantity: 1 } // Té Oolong
            ],
            // Orden 4 (Takeout - María)
            [
                { dishIndex: 3, quantity: 2 }, // Wonton Frito
                { dishIndex: 4, quantity: 1 }, // Pato Laqueado
                { dishIndex: 7, quantity: 2 }, // Pollo Agridulce
                { dishIndex: 11, quantity: 1 } // Vegetales Salteados
            ],
            // Orden 5 (Takeout - Carlos)
            [
                { dishIndex: 1, quantity: 2 }, // Hakao
                { dishIndex: 6, quantity: 1, specialInstructions: 'Para llevar en contenedor separado' }, // Arroz Frito
                { dishIndex: 12, quantity: 1 } // Chee Cheong Fun
            ],
            // Orden 6 (Takeout - Ana)
            [
                { dishIndex: 0, quantity: 1 }, // Siu Mai
                { dishIndex: 5, quantity: 1 }, // Chow Mein
                { dishIndex: 8, quantity: 1 } // Té Verde
            ]
        ]

        const insertedOrderDetails = []

        // Crear detalles para cada orden
        for (let orderIndex = 0; orderIndex < orders.length && orderIndex < orderDetailsData.length; orderIndex++) {
            const order = orders[orderIndex]
            const items = orderDetailsData[orderIndex]

            for (const item of items) {
                const dish = dishes[item.dishIndex]
                if (!dish) continue

                const unitPrice = dish.hasPromotion ? dish.promotionPrice : dish.price
                const subtotal = item.quantity * unitPrice

                const orderDetailData = {
                    orderId: order._id,
                    dishId: dish._id,
                    quantity: item.quantity,
                    unitPrice: unitPrice,
                    subtotal: subtotal,
                    specialInstructions: item.specialInstructions || ''
                }

                const orderDetail = new OrderDetail(orderDetailData)
                const savedOrderDetail = await orderDetail.save()
                insertedOrderDetails.push(savedOrderDetail)
            }
        }

        console.log(`✅ ${insertedOrderDetails.length} detalles de orden insertados`)

        // Estadísticas
        const totalQuantity = insertedOrderDetails.reduce((sum, detail) => sum + detail.quantity, 0)
        const totalAmount = insertedOrderDetails.reduce((sum, detail) => sum + detail.subtotal, 0)

        console.log(`📦 ${totalQuantity} items totales | 💰 $${totalAmount.toFixed(2)} en subtotales`)

        return insertedOrderDetails

    } catch (error) {
        console.error('❌ Error en seeder de detalles de orden:', error.message)
        throw error
    }
}

// Solo ejecutar directamente si es llamado como script principal
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('📝 Ejecutando seeder de detalles de orden...')

    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI no definida')
        process.exit(1)
    }

    try {
        await seedOrderDetails()
        console.log('🎉 Seeder de detalles de orden completado')
        await mongoose.connection.close()
        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}