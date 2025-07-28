// src/routes/IndexRoutes.js
import AdminRoutes from './AdminRoute.js'
import PublicRoutes from './PublicRoute.js'
import ChefRoutes from './ChefRoute.js'

export default function (fastify) {
    AdminRoutes(fastify)
    PublicRoutes(fastify)
    ChefRoutes(fastify)
}
