// src/modules/DishModule/DishRoutes.js
import {
    listDishes,
    getDish,
    createDish,
    updateDish,
    deleteDish,
    getAvailableDishes
} from './DishService.js'

import { verificarAdmin } from '../../common/middleware/AuthMiddleware.js'

// Rutas de administrador
export function dishAdminRoutes(fastify) {
    // US-020: Gestionar menú del restaurante (crear, editar, eliminar)
    fastify.get('/api/admin/dishes',
        // { preHandler: verificarAdmin },
        listDishes)
    fastify.get('/api/admin/dishes/:id',
        { preHandler: verificarAdmin }, 
        getDish)
    fastify.post('/api/admin/dishes',
        { preHandler: verificarAdmin }, 
        createDish)
    fastify.put('/api/admin/dishes/:id',
        { preHandler: verificarAdmin }, 
        updateDish)
    fastify.delete('/api/admin/dishes/:id',
        { preHandler: verificarAdmin }, 
        deleteDish)
}

// Rutas públicas
export function dishPublicRoutes(fastify) {
    // US-002: Visualización del menú (nombres, precios, fotografías)
    fastify.get('/api/menu', getAvailableDishes)
    // US-003: Ver descripción detallada del platillo
    fastify.get('/api/menu/:id', getDish)
}

// Exportación por defecto (todas las rutas juntas)
export default function (fastify) {
    dishAdminRoutes(fastify)
    dishPublicRoutes(fastify)
}