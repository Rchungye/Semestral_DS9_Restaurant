// src/routes/TableRoutes.js
import {
    listTables,
    getTable,
    getTableByQR,
    createTable,
    updateTable,
    deleteTable,
    // generateQRForTable
} from '../services/TableServices.js'

import { verificarAdmin } from '../middleware/AuthMiddleware.js'

export default function (fastify) {
    // ============= ENDPOINTS PARA ADMINISTRADORES =============
    // US-024: Gestionar información de mesas del restaurante
    fastify.get('/api/admin/tables', { preHandler: verificarAdmin }, listTables)
    fastify.get('/api/admin/tables/:id', { preHandler: verificarAdmin }, getTable)
    fastify.post('/api/admin/tables', { preHandler: verificarAdmin }, createTable)
    fastify.put('/api/admin/tables/:id', { preHandler: verificarAdmin }, updateTable)
    fastify.delete('/api/admin/tables/:id', { preHandler: verificarAdmin }, deleteTable)

    // US-024: Asignar o reemplazar códigos QR por mesa
    // fastify.post('/api/admin/tables/:id/qr/regenerate', { preHandler: verificarAdmin }, generateQRForTable)

    // ============= ENDPOINTS PÚBLICOS PARA CLIENTES =============
    // US-001: Escaneo de código QR para identificar mesa
    fastify.get('/api/qr/:qr', getTableByQR)

}