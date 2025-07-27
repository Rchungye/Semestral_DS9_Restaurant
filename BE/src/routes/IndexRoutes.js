// src/routes/IndexRoutes.js
import DishRoutes from './DishRoutes.js'
import PromotionRoutes from './PromotionRoutes.js'
import TableRoutes from './TableRoutes.js'
import UserRoutes from './UserRoutes.js'

export default function (fastify) {
    DishRoutes(fastify)
    TableRoutes(fastify)
    UserRoutes(fastify)
    PromotionRoutes(fastify)
}
