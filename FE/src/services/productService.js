import { ApiService } from './api.config'

// Obtiene todos los productos del backend
export const fetchProductos = async () => {
  try {
    const response = await ApiService.get('/productos')
    return response.data
  } catch (error) {
    // Puedes manejar el error como prefieras
    return []
  }
}