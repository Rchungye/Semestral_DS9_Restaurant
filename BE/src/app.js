// src/app.js

import Fastify from 'fastify'
import dotenv from 'dotenv'
import routes from './routes/IndexRoute.js'
import cors from '@fastify/cors'
import { conectarDB } from './common/config/MongoDbConfig.js'

// Cargar variables de entorno
dotenv.config()

const fastify = Fastify({ logger: true })

await fastify.register(cors, {
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ← ESTO ES LO IMPORTANTE
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
})

routes(fastify)

const iniciarServidor = async () => {
    try {
        await conectarDB()

        const puerto = process.env.PORT
        await fastify.listen({ port: puerto})

        console.log('\n🎉 Servidor iniciado en http://localhost:' + puerto)
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error)
        process.exit(1)
    }
}

process.on('SIGINT', async () => {
    console.log('\n🛑 Cerrando servidor...')
    try {
        await fastify.close()
        console.log('✅ Servidor cerrado correctamente')
        process.exit(0)
    } catch (error) {
        console.error('❌ Error al cerrar el servidor:', error)
        process.exit(1)
    }
})

iniciarServidor()
