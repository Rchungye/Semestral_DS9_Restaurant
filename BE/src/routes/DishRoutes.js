// src/routes/DishRoutes.js
import {
    listDishes,
    getDish,
    createDish,
    updateDish,
    deleteDish
} from '../services/DishServices.js'

import { verificarToken } from '../middleware/AuthMiddleware.js'

export default function (fastify) {
    // API RESTful endpoints - todos en inglés
    fastify.get('/api/dishes', { preHandler: verificarToken }, listDishes)
    fastify.get('/api/dishes/:id', { preHandler: verificarToken }, getDish)
    fastify.post('/api/dishes', { preHandler: verificarToken }, createDish)
    fastify.put('/api/dishes/:id', { preHandler: verificarToken }, updateDish)
    fastify.delete('/api/dishes/:id', { preHandler: verificarToken }, deleteDish)

    // Endpoints públicos para el frontend del cliente (sin autenticación)
    fastify.get('/public/dishes', listDishes)
    fastify.get('/public/dishes/:id', getDish)
}