// src/modules/PromotionModule/PromotionRepository.js
import Promotion from './PromotionModel.js'

export const getAllPromotions = async () => {
    return await Promotion.find()
}

export const getPromotionByIncrementalId = async (idIncremental) => {
    const id = parseInt(idIncremental)
    if (isNaN(id) || id <= 0) {
        throw new Error('ID incremental inválido')
    }
    return await Promotion.findOne({ idIncremental: id })
}

export const createPromotion = async (data) => {
    const newPromotion = new Promotion(data)
    return await newPromotion.save()
}

export const updatePromotion = async (idIncremental, data) => {
    const id = parseInt(idIncremental)
    if (isNaN(id) || id <= 0) {
        throw new Error('ID incremental inválido')
    }
    delete data.idIncremental
    return await Promotion.findOneAndUpdate(
        { idIncremental: id },
        data,
        { new: true }
    )
}

export const deletePromotion = async (idIncremental) => {
    const id = parseInt(idIncremental)
    if (isNaN(id) || id <= 0) {
        throw new Error('ID incremental inválido')
    }
    const resultado = await Promotion.findOneAndDelete({ idIncremental: id })
    return resultado !== null
}

// Funciones específicas para promociones
export const getActivePromotions = async () => {
    const now = new Date()
    return await Promotion.find({
        isActive: true,
        validFrom: { $lte: now },
        validTo: { $gte: now }
    })
}

export const incrementPromotionUsage = async (idIncremental) => {
    const id = parseInt(idIncremental)
    if (isNaN(id) || id <= 0) {
        throw new Error('ID incremental inválido')
    }

    return await Promotion.findOneAndUpdate(
        { idIncremental: id },
        { $inc: { currentUses: 1 } },
        { new: true }
    )
}

export const validatePromotionForDish = async (dishCategory) => {
    const now = new Date();

    // Buscar promociones activas y vigentes
    const promotions = await Promotion.find({
        isActive: true,
        validFrom: { $lte: now },
        validTo: { $gte: now },
    });

    // Filtrar si aplica a la categoría
    const applicablePromotions = promotions.filter(promo => {
        // Si no tiene categorías específicas, aplica a todos
        if (!promo.applicableToCategories || promo.applicableToCategories.length === 0) {
            return true;
        }
        // Caso contrario, valida si la categoría está incluida
        return promo.applicableToCategories.includes(dishCategory);
    });

    return applicablePromotions;
};