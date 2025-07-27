// src/routes/PromotionRoutes.js
import {
  listPromotions,
  getPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getActivePromotions,
} from '../services/PromotionServices.js'

import { verificarToken } from '../middleware/AuthMiddleware.js'

export default function (fastify) {
  // ============= API RESTful endpoints (protegidas) =============
  fastify.get('/api/promotions', { preHandler: verificarToken }, listPromotions)
  fastify.get('/api/promotions/:id', { preHandler: verificarToken }, getPromotion)
  fastify.post('/api/promotions', { preHandler: verificarToken }, createPromotion)
  fastify.put('/api/promotions/:id', { preHandler: verificarToken }, updatePromotion)
  fastify.delete('/api/promotions/:id', { preHandler: verificarToken }, deletePromotion)
  
  // ============= Endpoints públicos para clientes =============
  fastify.get('/public/promotions/active', getActivePromotions) // Ver promociones activas
}