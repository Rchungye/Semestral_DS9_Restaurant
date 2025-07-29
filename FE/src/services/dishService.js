import { ApiService } from "./api.config"

// Obtiene todos los platos disponibles del menú público (sin promociones)
export const fetchDishes = async () => {
  try {
    const response = await ApiService.get("/api/menu")
    return response.data
  } catch (error) {
    console.error("Error fetching dishes:", error)
    return []
  }
}

// NUEVA FUNCIÓN: Obtiene platos con promociones aplicables
export const fetchDishesWithPromotions = async () => {
  try {
    const response = await ApiService.get("/api/menu/with-promotions")
    return response.data
  } catch (error) {
    console.error("Error fetching dishes with promotions:", error)
    // Fallback a la función original si falla
    return await fetchDishes()
  }
}

// Obtiene un plato específico por ID
export const fetchDishById = async (id) => {
  try {
    const response = await ApiService.get(`/api/menu/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching dish:", error)
    return null
  }
}

// ============= FUNCIONES PARA ADMIN =============

// Obtiene todos los platos (admin)
export const fetchAllDishes = async () => {
  try {
    const response = await ApiService.get("/api/admin/dishes")
    return response.data
  } catch (error) {
    console.error("Error fetching all dishes:", error)
    return []
  }
}

// Crea un nuevo plato (admin)
export const createDish = async (dishData) => {
  try {
    const response = await ApiService.post("/api/admin/dishes", dishData)
    return response.data
  } catch (error) {
    console.error("Error creating dish:", error)
    throw error
  }
}

// Actualiza un plato (admin)
export const updateDish = async (id, dishData) => {
  try {
    const response = await ApiService.put(`/api/admin/dishes/${id}`, dishData)
    return response.data
  } catch (error) {
    console.error("Error updating dish:", error)
    throw error
  }
}

// Elimina un plato (admin)
export const deleteDish = async (id) => {
  try {
    const response = await ApiService.delete(`/api/admin/dishes/${id}`)
    return response.data
  } catch (error) {
    console.error("Error deleting dish:", error)
    throw error
  }
}
