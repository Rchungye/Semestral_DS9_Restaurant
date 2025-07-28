// src/modules/PromotionModule/PromotionRoutes.js
import {
  listPromotions,
  getPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getActivePromotions,
  validatePromotion
} from './PromotionServices.js'

import { verificarAdmin } from '../../middleware/AuthMiddleware.js'

// Rutas de administrador
export function promotionAdminRoutes(fastify) {
  // US-026: Configurar promociones o descuentos
  fastify.get('/api/admin/promotions', { preHandler: verificarAdmin }, listPromotions)
  fastify.get('/api/admin/promotions/:id', { preHandler: verificarAdmin }, getPromotion)
  fastify.post('/api/admin/promotions', { preHandler: verificarAdmin }, createPromotion)
  fastify.put('/api/admin/promotions/:id', { preHandler: verificarAdmin }, updatePromotion)
  fastify.delete('/api/admin/promotions/:id', { preHandler: verificarAdmin }, deletePromotion)
}

// Rutas públicas
export function promotionPublicRoutes(fastify) {
  // US-026: Ver promociones activas automáticamente aplicadas
  fastify.get('/api/promotions/active', getActivePromotions)
  // Validar si una promoción es aplicable a un platillo
  fastify.post('/api/promotions/validate', validatePromotion)
}

// Exportación por defecto (todas las rutas juntas)
export default function (fastify) {
  promotionAdminRoutes(fastify)
  promotionPublicRoutes(fastify)
}