import Fastify from 'fastify'
import dotenv from 'dotenv'
import routes from './routes/IndexRoutes.js'
import { conectarDB } from './config/MongoDbConfig.js'

// Cargar variables de entorno
dotenv.config()

const fastify = Fastify({ logger: true })

routes(fastify)

const iniciarServidor = async () => {
    try {
        // await conectarDB()

        const puerto = process.env.PORT
        const host = process.env.HOST
        await fastify.listen({ port: puerto, host: host })

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
