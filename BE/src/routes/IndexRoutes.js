// src/routes/IndexRoutes.js
import ProductRoutes from './ProductRoutes.js'
import DishRoutes from './DishRoutes.js'
import TableRoutes from './TableRoutes.js'
import UserRoutes from './UserRoutes.js'

export default function (fastify) {
    ProductRoutes(fastify)
    DishRoutes(fastify)
    TableRoutes(fastify)
    UserRoutes(fastify)
}
