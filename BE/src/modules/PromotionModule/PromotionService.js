// src/modules/PromotionModule/PromotionServices.js
import * as promotionRepo from './PromotionRepository.js'

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

export const validatePromotion = async (request, reply) => {
  try {
    const { category } = request.body;

    if (!category) {
      return reply.code(400).send({
        error: 'Missing required field: category'
      });
    }

    const promotions = await promotionRepo.validatePromotionForDish(category);

    if (!promotions || promotions.length === 0) {
      return reply.code(200).send({
        applicable: false,
        promotions: []
      });
    }

    return reply.code(200).send({
      applicable: true,
      promotions
    });
  } catch (error) {
    return reply.code(500).send({ error: 'Error validating promotion' });
  }
};
