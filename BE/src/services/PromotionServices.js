// src/services/PromotionServices.js
import * as promotionRepo from '../repositories/PromotionRepository.js'

export const listPromotions = async (request, reply) => {
  try {
    const promotions = await promotionRepo.getAllPromotions()
    return promotions
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving promotions' })
  }
}

export const getPromotion = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const promotion = await promotionRepo.getPromotionByIncrementalId(idIncremental)
    if (!promotion) {
      return reply.code(404).send({ error: 'Promotion not found' })
    }
    return promotion
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    return reply.code(500).send({ error: 'Error retrieving promotion' })
  }
}

export const createPromotion = async (request, reply) => {
  try {
    const data = request.body

    // Validar campos obligatorios
    if (!data.name || !data.discountType || data.discountValue == null || !data.validFrom || !data.validTo) {
      return reply.code(400).send({
        error: 'Missing required fields: name, discountType, discountValue, validFrom, validTo'
      })
    }

    // Validar fechas
    const validFrom = new Date(data.validFrom)
    const validTo = new Date(data.validTo)

    if (validFrom >= validTo) {
      return reply.code(400).send({
        error: 'validFrom must be before validTo'
      })
    }

    // Validar descuento
    if (data.discountType === 'porcentaje' && (data.discountValue <= 0 || data.discountValue > 100)) {
      return reply.code(400).send({
        error: 'Percentage discount must be between 1 and 100'
      })
    }

    if (data.discountType === 'monto_fijo' && data.discountValue <= 0) {
      return reply.code(400).send({
        error: 'Fixed amount discount must be greater than 0'
      })
    }

    // Validar días de la semana
    if (data.validDays && data.validDays.some(day => day < 0 || day > 6)) {
      return reply.code(400).send({
        error: 'Valid days must be between 0 (Sunday) and 6 (Saturday)'
      })
    }

    const newPromotion = await promotionRepo.createPromotion(data)
    return reply.code(201).send(newPromotion)
  } catch (error) {
    return reply.code(500).send({ error: 'Error creating promotion' })
  }
}

export const updatePromotion = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const data = request.body

    // Validar fechas si se proporcionan
    if (data.validFrom && data.validTo) {
      const validFrom = new Date(data.validFrom)
      const validTo = new Date(data.validTo)

      if (validFrom >= validTo) {
        return reply.code(400).send({
          error: 'validFrom must be before validTo'
        })
      }
    }

    // Validar descuento si se proporciona
    if (data.discountType === 'porcentaje' && data.discountValue != null) {
      if (data.discountValue <= 0 || data.discountValue > 100) {
        return reply.code(400).send({
          error: 'Percentage discount must be between 1 and 100'
        })
      }
    }

    if (data.discountType === 'monto_fijo' && data.discountValue != null) {
      if (data.discountValue <= 0) {
        return reply.code(400).send({
          error: 'Fixed amount discount must be greater than 0'
        })
      }
    }

    const updatedPromotion = await promotionRepo.updatePromotion(idIncremental, data)
    if (!updatedPromotion) {
      return reply.code(404).send({ error: 'Promotion not found' })
    }
    return updatedPromotion
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    return reply.code(500).send({ error: 'Error updating promotion' })
  }
}

export const deletePromotion = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const deleted = await promotionRepo.deletePromotion(idIncremental)
    if (!deleted) {
      return reply.code(404).send({ error: 'Promotion not found' })
    }
    return reply.code(200).send({
      message: 'Promotion deleted successfully',
      id: parseInt(idIncremental)
    })
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    return reply.code(500).send({ error: 'Error deleting promotion' })
  }
}

export const getActivePromotions = async (request, reply) => {
  try {
    const promotions = await promotionRepo.getActivePromotions()
    return promotions
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving active promotions' })
  }
}

export const getPromotionsByCategory = async (request, reply) => {
  try {
    const category = request.params.category

    // Validar categoría
    const validCategories = ['entrada', 'plato_principal', 'bebida', 'acompañamiento']
    if (!validCategories.includes(category)) {
      return reply.code(400).send({
        error: 'Invalid category. Must be one of: ' + validCategories.join(', ')
      })
    }

    const promotions = await promotionRepo.getPromotionsByCategory(category)
    return promotions
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving promotions by category' })
  }
}

export const getPromotionsForToday = async (request, reply) => {
  try {
    const promotions = await promotionRepo.getPromotionsForToday()
    return promotions
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving today\'s promotions' })
  }
}

export const togglePromotionStatus = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const { isActive } = request.body

    if (typeof isActive !== 'boolean') {
      return reply.code(400).send({
        error: 'isActive must be a boolean value'
      })
    }

    const updatedPromotion = await promotionRepo.updatePromotion(idIncremental, { isActive })
    if (!updatedPromotion) {
      return reply.code(404).send({ error: 'Promotion not found' })
    }

    return {
      message: `Promotion ${isActive ? 'activated' : 'deactivated'} successfully`,
      promotion: updatedPromotion
    }
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    return reply.code(500).send({ error: 'Error updating promotion status' })
  }
}

export const usePromotion = async (request, reply) => {
  try {
    const idIncremental = request.params.id

    // Verificar que la promoción existe y está activa
    const promotion = await promotionRepo.getPromotionByIncrementalId(idIncremental)
    if (!promotion) {
      return reply.code(404).send({ error: 'Promotion not found' })
    }

    if (!promotion.isActive) {
      return reply.code(400).send({ error: 'Promotion is not active' })
    }

    // Verificar vigencia
    const now = new Date()
    if (now < promotion.validFrom || now > promotion.validTo) {
      return reply.code(400).send({ error: 'Promotion is not valid at this time' })
    }

    // Verificar día de la semana si aplica
    if (promotion.validDays.length > 0) {
      const today = now.getDay()
      if (!promotion.validDays.includes(today)) {
        return reply.code(400).send({ error: 'Promotion is not valid today' })
      }
    }

    // Incrementar uso
    const updatedPromotion = await promotionRepo.incrementPromotionUsage(idIncremental)

    return {
      message: 'Promotion used successfully',
      promotion: updatedPromotion,
      discountApplied: {
        type: promotion.discountType,
        value: promotion.discountValue
      }
    }
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    return reply.code(500).send({ error: 'Error using promotion' })
  }
}

export const getExpiredPromotions = async (request, reply) => {
  try {
    const promotions = await promotionRepo.getExpiredPromotions()
    return promotions
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving expired promotions' })
  }
}

export const getUpcomingPromotions = async (request, reply) => {
  try {
    const promotions = await promotionRepo.getUpcomingPromotions()
    return promotions
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving upcoming promotions' })
  }
}