// promotionsSeeder.js - Seeder de promociones Golden Panda

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Promotion from '../src/modules/PromotionModule/PromotionModel.js'

dotenv.config()

const promotions = [
    {
        name: "Descuento Dim Sum",
        description: "15% de descuento en todas las entradas",
        discountType: "porcentaje",
        discountValue: 15,
        applicableToCategories: ["entrada"],
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        validDays: [1, 2, 3, 4, 5], // Lunes a Viernes
        isActive: true
    },
    {
        name: "Happy Hour Bebidas",
        description: "$1.00 de descuento en bebidas",
        discountType: "monto_fijo",
        discountValue: 1.00,
        applicableToCategories: ["bebida"],
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        validDays: [5, 6], // Viernes y Sábado
        isActive: true
    },
    {
        name: "Combo Familiar",
        description: "20% descuento en platos principales los domingos",
        discountType: "porcentaje",
        discountValue: 20,
        applicableToCategories: ["plato_principal"],
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        validDays: [0], // Domingo
        isActive: true
    },
    {
        name: "Promoción General",
        description: "10% descuento en toda la carta",
        discountType: "porcentaje",
        discountValue: 10,
        applicableToCategories: [], // Aplica a todas las categorías
        validFrom: new Date('2024-06-01'),
        validTo: new Date('2024-06-30'),
        validDays: [0, 1, 2, 3, 4, 5, 6], // Todos los días
        isActive: false // Promoción inactiva por ahora
    }
]

export async function seedPromotions() {
    try {
        await mongoose.connect(process.env.MONGO_URI)

        await Promotion.deleteMany()

        const insertedPromotions = []
        for (const promotionData of promotions) {
            const newPromotion = new Promotion(promotionData)
            const savedPromotion = await newPromotion.save()
            insertedPromotions.push(savedPromotion)
        }

        console.log(`✅ ${insertedPromotions.length} promociones insertadas`)
        console.log(`🎁 ${insertedPromotions.filter(p => p.isActive).length} promociones activas`)

        return insertedPromotions
    } catch (error) {
        console.error('❌ Error en seeder de promociones:', error.message)
        throw error
    }
}

// Solo ejecutar directamente si es llamado como script principal
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('🎁 Ejecutando seeder de promociones...')

    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI no definida')
        process.exit(1)
    }

    try {
        await seedPromotions()
        console.log('🎉 Seeder de promociones completado')
        await mongoose.connection.close()
        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}