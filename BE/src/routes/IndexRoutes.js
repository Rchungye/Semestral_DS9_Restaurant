// src/routes/IndexRoutes.js
import AdminRoutes from './AdminRoutes.js'
import PublicRoutes from './PublicRoutes.js'
import ChefRoutes from './ChefRoutes.js'

export default function (fastify) {
    AdminRoutes(fastify)
    PublicRoutes(fastify)
    ChefRoutes(fastify)
}
