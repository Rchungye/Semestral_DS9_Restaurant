// src/modules/TableModule/TableRoutes.js
import {
    listTables,
    getTable,
    getTableByQR,
    createTable,
    updateTable,
    deleteTable
} from './TableService.js'

import { verificarAdmin } from '../../common/middleware/AuthMiddleware.js'

// Rutas de administrador
export function tableAdminRoutes(fastify) {
    // US-024: Gestionar información de mesas del restaurante
    fastify.get('/api/admin/tables',
        // { preHandler: verificarAdmin }, 
        listTables)
    fastify.get('/api/admin/tables/:id',
        // { preHandler: verificarAdmin }, 
        getTable)
    fastify.post('/api/admin/tables',
        // { preHandler: verificarAdmin }, 
        createTable)
    fastify.put('/api/admin/tables/:id',
        // { preHandler: verificarAdmin }, 
        updateTable)
    fastify.delete('/api/admin/tables/:id',
        // { preHandler: verificarAdmin }, 
        deleteTable)
}

// Rutas públicas
export function tablePublicRoutes(fastify) {
    // US-001: Escaneo de código QR para identificar mesa
    // Ahora el parámetro :qr contiene el MongoDB _id de la mesa
    fastify.get('/api/qr/:qr', getTableByQR)
}

// Exportación por defecto (todas las rutas juntas)
export default function (fastify) {
    tableAdminRoutes(fastify)
    tablePublicRoutes(fastify)
}