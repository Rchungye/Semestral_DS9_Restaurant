// src/middleware/AuthMiddleware.js
import { verifyToken } from '../helpers/CryptoHelper.js'

export const verificarToken = async (request, reply) => {
    try {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            return reply.code(401).send({
                error: 'Authorization header missing',
                message: 'Please provide Authorization header with Bearer token'
            })
        }

        // Verificar formato "Bearer TOKEN"
        const tokenParts = authHeader.split(' ')
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return reply.code(401).send({
                error: 'Invalid authorization format',
                message: 'Authorization header must be: Bearer <token>'
            })
        }

        const token = tokenParts[1]

        if (!token) {
            return reply.code(401).send({
                error: 'Token missing',
                message: 'No token provided in Authorization header'
            })
        }

        // Verificar y decodificar token
        const decoded = verifyToken(token)

        // Agregar información del usuario al request
        request.user = decoded

        // Log para debugging (opcional - remover en producción)
        console.log(`🔓 Usuario autenticado: ${decoded.username} (${decoded.role}) - ID: ${decoded.id}`)

    } catch (error) {
        console.error('🚫 Error de autenticación:', error.message)
        
        // Manejar diferentes tipos de errores JWT
        if (error.name === 'TokenExpiredError') {
            return reply.code(401).send({
                error: 'Token expired',
                message: 'Please login again to get a new token'
            })
        }
        
        if (error.name === 'JsonWebTokenError') {
            return reply.code(401).send({
                error: 'Invalid token',
                message: 'The provided token is malformed or invalid'
            })
        }
        
        if (error.message === 'Invalid token') {
            return reply.code(401).send({
                error: 'Invalid or expired token',
                message: 'Please login again'
            })
        }

        return reply.code(500).send({
            error: 'Error verifying token',
            message: 'Internal server error during authentication'
        })
    }
}

// Middleware opcional para verificar roles específicos
export const verificarAdmin = async (request, reply) => {
    // Primero verificar el token
    await verificarToken(request, reply)
    
    // Si hay error en la verificación del token, se habrá enviado la respuesta ya
    if (reply.sent) return
    
    // Si llegamos aquí, el token es válido
    if (request.user && request.user.role !== 'administrador') {
        return reply.code(403).send({
            error: 'Insufficient permissions',
            message: 'This endpoint requires administrator role'
        })
    }
}

// Middleware opcional para verificar cocinero o admin
export const verificarCocina = async (request, reply) => {
    // Primero verificar el token
    await verificarToken(request, reply)
    
    // Si hay error en la verificación del token, se habrá enviado la respuesta ya
    if (reply.sent) return
    
    // Si llegamos aquí, el token es válido
    if (request.user && !['administrador', 'cocinero'].includes(request.user.role)) {
        return reply.code(403).send({
            error: 'Insufficient permissions',
            message: 'This endpoint requires administrator or cook role'
        })
    }
}