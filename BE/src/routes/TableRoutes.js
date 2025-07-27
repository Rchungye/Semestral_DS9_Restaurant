// src/routes/TableRoutes.js
import {
    listTables,
    getTable,
    getTableByNumber,
    getTableByQR,
    createTable,
    updateTable,
    deleteTable,
    getAvailableTables,
    getOccupiedTables,
    updateTableStatus
} from '../services/TableServices.js'

import { verificarToken } from '../middleware/AuthMiddleware.js'

export default function (fastify) {
    // ============= API RESTful endpoints (protegidas) =============
    fastify.get('/api/tables', { preHandler: verificarToken }, listTables)
    fastify.get('/api/tables/:id', { preHandler: verificarToken }, getTable)
    fastify.post('/api/tables', { preHandler: verificarToken }, createTable)
    fastify.put('/api/tables/:id', { preHandler: verificarToken }, updateTable)
    fastify.delete('/api/tables/:id', { preHandler: verificarToken }, deleteTable)

    // ============= Endpoints específicos para mesas (protegidas) =============
    fastify.get('/api/tables/available/list', { preHandler: verificarToken }, getAvailableTables)
    fastify.get('/api/tables/occupied/list', { preHandler: verificarToken }, getOccupiedTables)
    fastify.patch('/api/tables/:id/status', { preHandler: verificarToken }, updateTableStatus)

    // ============= Endpoints de búsqueda (protegidas) =============
    fastify.get('/api/tables/number/:number', { preHandler: verificarToken }, getTableByNumber)

    // ============= Endpoints públicos para clientes =============
    fastify.get('/public/tables/qr/:qr', getTableByQR) // Para escanear QR
    fastify.get('/public/tables/available', getAvailableTables) // Ver mesas disponibles
}