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
    fastify.get('/api/dishes', listDishes)
    fastify.get('/api/dishes/:id', getDish)
    fastify.post('/api/dishes', createDish)
    fastify.put('/api/dishes/:id', updateDish)
    fastify.delete('/api/dishes/:id', deleteDish)
}