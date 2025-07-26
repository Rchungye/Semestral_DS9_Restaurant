// src/config/MongoDbConfig.js
import mongoose from 'mongoose'

export async function conectarDB() {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/golden_panda'
        console.log('Intentando conectar a:', uri); // <-- Aquí el log
        await mongoose.connect(uri)

        console.log('✅ Conexión a MongoDB establecida')
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error)
        process.exit(1)
    }
}
