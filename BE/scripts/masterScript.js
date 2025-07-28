// masterSeeder.js - Seeder maestro para Golden Panda

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { seedUsers } from './database/usersSeeder.js'
import { seedDishes } from './database/dishesSeeder.js'
import { seedTables } from './database/tablesSeeder.js'
import { seedPromotions } from './database/promotionsSeeder.js'
import { seedOrders } from './database/ordersSeeder.js'
import { seedOrderDetails } from './database/orderDetailsSeeder.js'
import { seedTransactions } from './database/transactionsSeeder.js'

dotenv.config()

async function runMasterSeeder() {
    console.log('🚀 Iniciando seeder maestro Golden Panda...')
    console.log('================================================')

    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI no está definida en el archivo .env')
        process.exit(1)
    }

    try {
        // Conectar una sola vez
        await mongoose.connect(process.env.MONGO_URI)
        console.log('🟢 Conectado a MongoDB exitosamente')
        console.log('')

        const results = {}
        let totalTime = Date.now()

        // 1. Usuarios
        console.log('👥 Seeding usuarios...')
        const startUsers = Date.now()
        results.users = await seedUsers()
        console.log(`⏱️  Completado en ${Date.now() - startUsers}ms`)
        console.log('')

        // 2. Platillos
        console.log('🍜 Seeding platillos...')
        const startDishes = Date.now()
        results.dishes = await seedDishes()
        console.log(`⏱️  Completado en ${Date.now() - startDishes}ms`)
        console.log('')

        // 3. Mesas
        console.log('🪑 Seeding mesas...')
        const startTables = Date.now()
        results.tables = await seedTables()
        console.log(`⏱️  Completado en ${Date.now() - startTables}ms`)
        console.log('')

        // 4. Promociones
        console.log('🎁 Seeding promociones...')
        const startPromotions = Date.now()
        results.promotions = await seedPromotions()
        console.log(`⏱️  Completado en ${Date.now() - startPromotions}ms`)
        console.log('')

        // 5. Órdenes
        console.log('📋 Seeding órdenes...')
        const startOrders = Date.now()
        results.orders = await seedOrders()
        console.log(`⏱️  Completado en ${Date.now() - startOrders}ms`)
        console.log('')

        // 6. Detalles de órdenes
        console.log('📝 Seeding detalles de órdenes...')
        const startOrderDetails = Date.now()
        results.orderDetails = await seedOrderDetails()
        console.log(`⏱️  Completado en ${Date.now() - startOrderDetails}ms`)
        console.log('')

        // 7. Transacciones
        console.log('💳 Seeding transacciones...')
        const startTransactions = Date.now()
        results.transactions = await seedTransactions()
        console.log(`⏱️  Completado en ${Date.now() - startTransactions}ms`)
        console.log('')

        // Resumen final
        totalTime = Date.now() - totalTime
        console.log('================================================')
        console.log('🎉 SEEDER MAESTRO COMPLETADO EXITOSAMENTE')
        console.log('================================================')
        console.log('📊 Resumen de datos insertados:')
        console.log(`   👥 Usuarios: ${results.users.length}`)
        console.log(`   🍜 Platillos: ${results.dishes.length}`)
        console.log(`   🪑 Mesas: ${results.tables.length}`)
        console.log(`   🎁 Promociones: ${results.promotions.length}`)
        console.log(`   📋 Órdenes: ${results.orders.length}`)
        console.log(`   📝 Detalles de orden: ${results.orderDetails.length}`)
        console.log(`   💳 Transacciones: ${results.transactions.length}`)
        console.log('')
        console.log('🔐 Credenciales de acceso:')
        console.log('   Admin: admin / admin123')
        console.log('   Chef: chef.chen / chen123')
        console.log('')
        console.log('📱 QR dinámico: Usa el MongoDB _id de cada mesa')
        console.log(`⏱️  Tiempo total: ${totalTime}ms`)
        console.log('')
        console.log('🏮 El restaurante Golden Panda está listo para funcionar!')
        console.log('📈 Sistema completo con flujo de trabajo realista')

    } catch (error) {
        console.error('❌ Error en el seeder maestro:', error.message)
        console.error('🔍 Stack:', error.stack)
        process.exit(1)
    } finally {
        await mongoose.connection.close()
        console.log('🔴 Conexión a MongoDB cerrada')
        process.exit(0)
    }
}

// Ejecutar seeder maestro
runMasterSeeder()