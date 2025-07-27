// src/routes/TableRoutes.js
import {
    listTables,
    getTable,
    getTableByNumber,
    getTableByQR,
    createTable,
    updateTable,
    deleteTable,
} from '../services/TableServices.js'

import { verificarToken } from '../middleware/AuthMiddleware.js'

export default function (fastify) {
    // ============= API RESTful endpoints (protegidas) =============
    fastify.get('/api/tables', { preHandler: verificarToken }, listTables)
    fastify.get('/api/tables/:id', { preHandler: verificarToken }, getTable)
    fastify.post('/api/tables', { preHandler: verificarToken }, createTable)
    fastify.put('/api/tables/:id', { preHandler: verificarToken }, updateTable)
    fastify.delete('/api/tables/:id', { preHandler: verificarToken }, deleteTable)

    // ============= Endpoints públicos para clientes =============
    fastify.get('/public/tables/qr/:qr', getTableByQR) // Para escanear QR
}