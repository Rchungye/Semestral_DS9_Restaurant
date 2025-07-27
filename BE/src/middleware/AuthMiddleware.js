// src/middleware/AuthMiddleware.js
import { verifyToken } from '../helpers/CryptoHelper.js'

export const verificarToken = async (request, reply) => {
    try {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            return reply.code(401).send({
                error: 'Authorization header missing'
            })
        }

        const token = authHeader.split(' ')[1] // Extraer token de "Bearer TOKEN"

        if (!token) {
            return reply.code(401).send({
                error: 'Token missing'
            })
        }

        // Verificar y decodificar token
        const decoded = verifyToken(token)

        // Agregar información del usuario al request
        request.user = decoded

    } catch (error) {
        if (error.message === 'Invalid token') {
            return reply.code(401).send({
                error: 'Invalid or expired token'
            })
        }

        return reply.code(500).send({
            error: 'Error verifying token'
        })
    }
}