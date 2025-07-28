// src/routes/IndexRoutes.js
import DishRoutes from './DishRoutes.js'
import OrderDetailRoutes from './OrderDetailRoutes.js'
import PromotionRoutes from './PromotionRoutes.js'
import TableRoutes from './TableRoutes.js'
import UserRoutes from './UserRoutes.js'
import OrderRoutes from './OrderRoutes.js'
import TransactionRoutes from './TransactionRoutes.js'

export default function (fastify) {
    DishRoutes(fastify)
    TableRoutes(fastify)
    UserRoutes(fastify)
    PromotionRoutes(fastify)
    OrderDetailRoutes(fastify)
    OrderRoutes(fastify)
    TransactionRoutes(fastify)
}
