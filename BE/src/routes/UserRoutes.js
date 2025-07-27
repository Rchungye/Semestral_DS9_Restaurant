// src/routes/UserRoutes.js
import {
    login,
    logout,
    listUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} from '../services/UserServices.js'

import { verificarToken } from '../middleware/AuthMiddleware.js'

export default function (fastify) {
    // ============= RUTAS DE AUTENTICACIÓN (públicas) =============
    fastify.post('/api/auth/login', login)
    fastify.post('/api/auth/logout', { preHandler: verificarToken }, logout)

    // ============= RUTAS CRUD USUARIOS (protegidas) =============
    fastify.get('/api/users', { preHandler: verificarToken }, listUsers)
    fastify.get('/api/users/:id', { preHandler: verificarToken }, getUser)
    fastify.post('/api/users', { preHandler: verificarToken }, createUser)
    fastify.put('/api/users/:id', { preHandler: verificarToken }, updateUser)
    fastify.delete('/api/users/:id', { preHandler: verificarToken }, deleteUser)
}