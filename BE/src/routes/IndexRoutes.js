// src/routes/IndexRoutes.js
import ProductRoutes from './ProductRoutes.js'
import WahRoutes from './WahRoutes.js'

export default function (fastify) {
    ProductRoutes(fastify)
    WahRoutes(fastify)
}
