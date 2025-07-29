import { ApiService } from "./api.config"

// ============= FUNCIONES PARA ADMIN =============

// Obtener todas las mesas
export const getAllTables = async () => {
  try {
    const response = await ApiService.get("/api/admin/tables")
    return response.data
  } catch (error) {
    console.error("Error fetching tables:", error)
    return []
  }
}

// Obtener mesa por ID incremental
export const getTable = async (idIncremental) => {
  try {
    const response = await ApiService.get(`/api/admin/tables/${idIncremental}`)
    return response.data
  } catch (error) {
    console.error("Error fetching table:", error)
    return null
  }
}

// Crear nueva mesa
export const createTable = async (tableData) => {
  try {
    const response = await ApiService.post("/api/admin/tables", tableData)
    return response.data
  } catch (error) {
    console.error("Error creating table:", error)
    throw error
  }
}

// Actualizar mesa
export const updateTable = async (idIncremental, tableData) => {
  try {
    const response = await ApiService.put(`/api/admin/tables/${idIncremental}`, tableData)
    return response.data
  } catch (error) {
    console.error("Error updating table:", error)
    throw error
  }
}

// Eliminar mesa
export const deleteTable = async (idIncremental) => {
  try {
    const response = await ApiService.delete(`/api/admin/tables/${idIncremental}`)
    return response.data
  } catch (error) {
    console.error("Error deleting table:", error)
    throw error
  }
}

// ============= FUNCIONES PÚBLICAS =============

// Obtener mesa por código QR (MongoDB ID)
export const getTableByQR = async (mongoId) => {
  try {
    const response = await ApiService.get(`/api/qr/${mongoId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching table by QR:", error)
    return null
  }
}
