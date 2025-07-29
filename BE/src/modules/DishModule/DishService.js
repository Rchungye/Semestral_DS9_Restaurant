// src/modules/DishModule/DishServices.js
import * as dishRepo from './DishRepository.js'
import * as promotionRepo from "../PromotionModule/PromotionRepository.js"

export const listDishes = async (request, reply) => {
    try {
        const dishes = await dishRepo.getAllDishes()
        return dishes
    } catch (error) {
        return reply.code(500).send({ error: 'Error retrieving dishes' })
    }
}

export const getDish = async (request, reply) => {
    try {
        const idIncremental = request.params.id
        const dish = await dishRepo.getDishByIncrementalId(idIncremental)
        if (!dish) {
            return reply.code(404).send({ error: 'Dish not found' })
        }
        return dish
    } catch (error) {
        if (error.message === 'ID incremental inválido') {
            return reply.code(400).send({ error: 'Invalid incremental ID' })
        }
        return reply.code(500).send({ error: 'Error retrieving dish' })
    }
}

export const createDish = async (request, reply) => {
    try {
        const data = request.body
        if (!data.name || data.price == null || !data.category) {
            return reply.code(400).send({ error: 'Missing required fields: name, price, category' })
        }
        const newDish = await dishRepo.createDish(data)
        return reply.code(201).send(newDish)
    } catch (error) {
        if (error.code === 11000) {
            return reply.code(409).send({ error: 'Dish name already exists' })
        }
        return reply.code(500).send({ error: 'Error creating dish' })
    }
}

export const updateDish = async (request, reply) => {
    try {
        const idIncremental = request.params.id
        const data = request.body
        const updatedDish = await dishRepo.updateDish(idIncremental, data)
        if (!updatedDish) {
            return reply.code(404).send({ error: 'Dish not found' })
        }
        return updatedDish
    } catch (error) {
        if (error.message === 'ID incremental inválido') {
            return reply.code(400).send({ error: 'Invalid incremental ID' })
        }
        if (error.code === 11000) {
            return reply.code(409).send({ error: 'Dish name already exists' })
        }
        return reply.code(500).send({ error: 'Error updating dish' })
    }
}

export const deleteDish = async (request, reply) => {
    try {
        const idIncremental = request.params.id
        const deleted = await dishRepo.deleteDish(idIncremental)
        if (!deleted) {
            return reply.code(404).send({ error: 'Dish not found' })
        }
        return reply.code(200).send({
            message: 'Dish deleted successfully',
            id: parseInt(idIncremental)
        })
    } catch (error) {
        if (error.message === 'ID incremental inválido') {
            return reply.code(400).send({ error: 'Invalid incremental ID' })
        }
        return reply.code(500).send({ error: 'Error deleting dish' })
    }
}

export const getAvailableDishes = async (request, reply) => {
    try {
        const dishes = await dishRepo.getAvailableDishes()
        return dishes
    } catch (error) {
        return reply.code(500).send({ error: 'Error retrieving available dishes' })
    }
}

// NUEVA FUNCIÓN: Obtener platos disponibles con promociones aplicables
export const getAvailableDishesWithPromotions = async (request, reply) => {
  try {
    // Obtener todos los platos disponibles
    const dishes = await dishRepo.getAvailableDishes()

    // Obtener promociones activas
    const activePromotions = await promotionRepo.getActivePromotions()

    // Mapear platos con sus promociones aplicables
    const dishesWithPromotions = await Promise.all(
      dishes.map(async (dish) => {
        // Buscar promociones aplicables a este plato
        const applicablePromotions = activePromotions
          .filter((promotion) => {
            // Si no tiene categorías específicas, aplica a todos
            if (!promotion.applicableToCategories || promotion.applicableToCategories.length === 0) {
              return true
            }
            // Si tiene categorías específicas, verificar si incluye la del plato
            return promotion.applicableToCategories.includes(dish.category)
          })
          .filter((promotion) => {
            // Verificar días de la semana si están especificados
            if (promotion.validDays && promotion.validDays.length > 0) {
              const today = new Date().getDay() // 0 = Domingo, 6 = Sábado
              return promotion.validDays.includes(today)
            }
            return true
          })

        // Calcular el mejor descuento si hay promociones aplicables
        let bestPromotion = null
        let promotionPrice = dish.price

        if (applicablePromotions.length > 0) {
          // Encontrar la promoción con mayor descuento
          bestPromotion = applicablePromotions.reduce((best, current) => {
            const currentDiscount =
              current.discountType === "porcentaje" ? (dish.price * current.discountValue) / 100 : current.discountValue

            const bestDiscount =
              best.discountType === "porcentaje" ? (dish.price * best.discountValue) / 100 : best.discountValue

            return currentDiscount > bestDiscount ? current : best
          })

          // Calcular precio con promoción
          if (bestPromotion.discountType === "porcentaje") {
            promotionPrice = dish.price * (1 - bestPromotion.discountValue / 100)
          } else {
            promotionPrice = Math.max(0, dish.price - bestPromotion.discountValue)
          }
        }

        return {
          ...dish.toObject(),
          hasPromotion: applicablePromotions.length > 0,
          promotionPrice: applicablePromotions.length > 0 ? promotionPrice : null,
          promotionDetails: bestPromotion
            ? {
                name: bestPromotion.name,
                description: bestPromotion.description,
                discountType: bestPromotion.discountType,
                discountValue: bestPromotion.discountValue,
                savings: dish.price - promotionPrice,
              }
            : null,
          applicablePromotions: applicablePromotions.map((p) => ({
            id: p.idIncremental,
            name: p.name,
            discountType: p.discountType,
            discountValue: p.discountValue,
          })),
        }
      }),
    )

    return dishesWithPromotions
  } catch (error) {
    console.error("Error getting dishes with promotions:", error)
    return reply.code(500).send({ error: "Error retrieving dishes with promotions" })
  }
}