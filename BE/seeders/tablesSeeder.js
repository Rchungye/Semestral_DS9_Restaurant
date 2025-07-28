// tablesSeeder.js - Seeder de mesas Golden Panda

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Table from '../src/modules/TableModule/TableModel.js'

dotenv.config()

const tables = [
    // ÁREA PRINCIPAL - 7 mesas para 4 personas (reducido de 12 a 7)
    { tableNumber: 1, capacity: 4 },
    { tableNumber: 2, capacity: 4 },
    { tableNumber: 3, capacity: 4 },
    { tableNumber: 4, capacity: 4 },
    { tableNumber: 5, capacity: 4 },
    { tableNumber: 6, capacity: 4 },
    { tableNumber: 7, capacity: 4 },

    // ÁREA FAMILIAR - 2 mesas para 8 personas
    { tableNumber: 8, capacity: 8 },
    { tableNumber: 9, capacity: 8 },

    // ÁREA DE PAREJAS - 4 mesas para 2 personas
    { tableNumber: 10, capacity: 2 },
    { tableNumber: 11, capacity: 2 },
    { tableNumber: 12, capacity: 2 },
    { tableNumber: 13, capacity: 2 },

    // ÁREA DE TERRAZA - 2 mesas para 4 personas
    { tableNumber: 14, capacity: 4 },
    { tableNumber: 15, capacity: 4 }
]

export async function seedTables() {
    try {
        await mongoose.connect(process.env.MONGO_URI)

        await Table.deleteMany()

        const insertedTables = []
        for (const tableData of tables) {
            const newTable = new Table(tableData)
            const savedTable = await newTable.save()
            insertedTables.push(savedTable)
        }

        console.log(`✅ ${insertedTables.length} mesas insertadas`)
        console.log(`👥 Capacidad total: ${insertedTables.reduce((total, table) => total + table.capacity, 0)} personas`)

        return insertedTables
    } catch (error) {
        console.error('❌ Error en seeder de mesas:', error.message)
        throw error
    }
}

// Solo ejecutar directamente si es llamado como script principal
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('🪑 Ejecutando seeder de mesas...')

    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI no definida')
        process.exit(1)
    }

    try {
        await seedTables()
        console.log('🎉 Seeder de mesas completado')
        await mongoose.connection.close()
        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}