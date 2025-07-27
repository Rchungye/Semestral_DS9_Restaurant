// src/routes/PromotionRoutes.js
import {
  listPromotions,
  getPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getActivePromotions,
  validatePromotion
} from '../services/PromotionServices.js'

import { verificarAdmin } from '../middleware/AuthMiddleware.js'

export default function (fastify) {
  // ============= ENDPOINTS PARA ADMINISTRADORES =============
  // US-026: Configurar promociones o descuentos
  fastify.get('/api/admin/promotions', { preHandler: verificarAdmin }, listPromotions)
  fastify.get('/api/admin/promotions/:id', { preHandler: verificarAdmin }, getPromotion)
  fastify.post('/api/admin/promotions', { preHandler: verificarAdmin }, createPromotion)
  fastify.put('/api/admin/promotions/:id', { preHandler: verificarAdmin }, updatePromotion)
  fastify.delete('/api/admin/promotions/:id', { preHandler: verificarAdmin }, deletePromotion)

  // ============= ENDPOINTS PÚBLICOS PARA CLIENTES =============
  // US-026: Ver promociones activas automáticamente aplicadas
  fastify.get('/api/promotions/active', getActivePromotions)

  // Validar si una promoción es aplicable a un platillo
  fastify.post('/api/promotions/validate', validatePromotion)

}