// src/routes/DishRoutes.js
import {
    listDishes,
    getDish,
    createDish,
    updateDish,
    deleteDish,
    getAvailableDishes
} from '../services/DishServices.js'

import { verificarAdmin } from '../middleware/AuthMiddleware.js'

export default function (fastify) {
    // ============= ENDPOINTS PARA ADMINISTRADORES =============
    // US-020: Gestionar menú del restaurante (crear, editar, eliminar)
    fastify.get('/api/admin/dishes', { preHandler: verificarAdmin }, listDishes)
    fastify.get('/api/admin/dishes/:id', { preHandler: verificarAdmin }, getDish)
    fastify.post('/api/admin/dishes', { preHandler: verificarAdmin }, createDish)
    fastify.put('/api/admin/dishes/:id', { preHandler: verificarAdmin }, updateDish)
    fastify.delete('/api/admin/dishes/:id', { preHandler: verificarAdmin }, deleteDish)

    // ============= ENDPOINTS PÚBLICOS PARA CLIENTES =============
    // US-002: Visualización del menú (nombres, precios, fotografías)
    fastify.get('/api/menu', getAvailableDishes)

    // US-003: Ver descripción detallada del platillo
    fastify.get('/api/menu/:id', getDish)

}