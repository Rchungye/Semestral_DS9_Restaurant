// src/modules/UserModule/UserRoutes.js
import {
    login,
    logout,
    listUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserProfile
} from './UserServices.js'

import { verificarToken, verificarAdmin } from '../../middleware/AuthMiddleware.js'

// Rutas de administrador
export function userAdminRoutes(fastify) {
       // ============= RUTAS DE AUTENTICACIÓN (públicas) =============
    fastify.post('/api/auth/login', login)
    fastify.post('/api/auth/logout', { preHandler: verificarToken }, logout)
    // Obtener perfil del usuario autenticado
    fastify.get('/api/auth/profile', { preHandler: verificarToken }, getUserProfile)
    // ============= ENDPOINTS PARA ADMINISTRADORES =============
    // US-025: Gestionar usuarios y roles (solo administradores)
    fastify.get('/api/admin/users', { preHandler: verificarAdmin }, listUsers)
    fastify.get('/api/admin/users/:id', { preHandler: verificarAdmin }, getUser)
    fastify.post('/api/admin/users', { preHandler: verificarAdmin }, createUser)
    fastify.put('/api/admin/users/:id', { preHandler: verificarAdmin }, updateUser)
    fastify.delete('/api/admin/users/:id', { preHandler: verificarAdmin }, deleteUser)
}

// Exportación por defecto (todas las rutas juntas)
export default function (fastify) {
    userAdminRoutes(fastify)
}