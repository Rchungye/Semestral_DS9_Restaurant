// src/routes/PromotionRoutes.js
import {
  listPromotions,
  getPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getActivePromotions,
  getPromotionsByCategory,
  getPromotionsForToday,
  togglePromotionStatus,
  usePromotion,
  getExpiredPromotions,
  getUpcomingPromotions
} from '../services/PromotionServices.js'

import { verificarToken } from '../middleware/AuthMiddleware.js'

export default function (fastify) {
  // ============= API RESTful endpoints (protegidas) =============
  fastify.get('/api/promotions', { preHandler: verificarToken }, listPromotions)
  fastify.get('/api/promotions/:id', { preHandler: verificarToken }, getPromotion)
  fastify.post('/api/promotions', { preHandler: verificarToken }, createPromotion)
  fastify.put('/api/promotions/:id', { preHandler: verificarToken }, updatePromotion)
  fastify.delete('/api/promotions/:id', { preHandler: verificarToken }, deletePromotion)
  
  // ============= Endpoints específicos para promociones (protegidas) =============
  fastify.get('/api/promotions/status/active', { preHandler: verificarToken }, getActivePromotions)
  fastify.get('/api/promotions/status/expired', { preHandler: verificarToken }, getExpiredPromotions)
  fastify.get('/api/promotions/status/upcoming', { preHandler: verificarToken }, getUpcomingPromotions)
  fastify.get('/api/promotions/today/valid', { preHandler: verificarToken }, getPromotionsForToday)
  fastify.get('/api/promotions/category/:category', { preHandler: verificarToken }, getPromotionsByCategory)
  
  // ============= Endpoints de gestión (protegidas) =============
  fastify.patch('/api/promotions/:id/toggle', { preHandler: verificarToken }, togglePromotionStatus)
  fastify.post('/api/promotions/:id/use', { preHandler: verificarToken }, usePromotion)
  
  // ============= Endpoints públicos para clientes =============
  fastify.get('/public/promotions/active', getActivePromotions) // Ver promociones activas
  fastify.get('/public/promotions/today', getPromotionsForToday) // Promociones válidas hoy
  fastify.get('/public/promotions/category/:category', getPromotionsByCategory) // Por categoría
}