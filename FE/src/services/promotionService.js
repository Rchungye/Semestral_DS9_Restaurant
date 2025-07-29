import { ApiService } from "./api.config"

// ============= FUNCIONES PARA ADMIN =============

// Obtiene todas las promociones (admin)
export const fetchAllPromotions = async () => {
  try {
    const response = await ApiService.get("/api/admin/promotions")
    return response.data
  } catch (error) {
    console.error("Error fetching all promotions:", error)
    return []
  }
}

// Obtiene una promoción específica por ID
export const fetchPromotionById = async (id) => {
  try {
    const response = await ApiService.get(`/api/admin/promotions/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching promotion:", error)
    return null
  }
}

// Crea una nueva promoción (admin)
export const createPromotion = async (promotionData) => {
  try {
    const response = await ApiService.post("/api/admin/promotions", promotionData)
    return response.data
  } catch (error) {
    console.error("Error creating promotion:", error)
    throw error
  }
}

// Actualiza una promoción (admin)
export const updatePromotion = async (id, promotionData) => {
  try {
    const response = await ApiService.put(`/api/admin/promotions/${id}`, promotionData)
    return response.data
  } catch (error) {
    console.error("Error updating promotion:", error)
    throw error
  }
}

// Elimina una promoción (admin)
export const deletePromotion = async (id) => {
  try {
    const response = await ApiService.delete(`/api/admin/promotions/${id}`)
    return response.data
  } catch (error) {
    console.error("Error deleting promotion:", error)
    throw error
  }
}

// ============= FUNCIONES PÚBLICAS =============

// Obtiene promociones activas
export const fetchActivePromotions = async () => {
  try {
    const response = await ApiService.get("/api/promotions/active")
    return response.data
  } catch (error) {
    console.error("Error fetching active promotions:", error)
    return []
  }
}

// Valida si una promoción es aplicable a una categoría
export const validatePromotionForCategory = async (category) => {
  try {
    const response = await ApiService.post("/api/promotions/validate", { category })
    return response.data
  } catch (error) {
    console.error("Error validating promotion:", error)
    return { applicable: false, promotions: [] }
  }
}
