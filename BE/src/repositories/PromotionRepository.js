// src/repositories/PromotionRepository.js
import Promotion from '../models/PromotionModel.js'

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
