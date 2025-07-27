// src/services/ProductServices.js
import * as productRepo from '../repositories/ProductRepository.js'

export const listProducts = async (request, reply) => {
  try {
    const productos = await productRepo.getAllProducts()
    return productos
  } catch (error) {
    return reply.code(500).send({ error: 'Error al obtener productos' })
  }
}

export const getProduct = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const producto = await productRepo.getProductByIncrementalId(idIncremental)
    if (!producto) {
      return reply.code(404).send({ error: 'Producto no encontrado' })
    }
    return producto
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: error.message })
    }
    return reply.code(500).send({ error: 'Error al obtener producto' })
  }
}

export const createProduct = async (request, reply) => {
  try {
    const data = request.body
    if (!data.nombre || data.precio == null || !data.categoria) {
      return reply.code(400).send({ error: 'Faltan campos obligatorios' })
    }
    const nuevoProducto = await productRepo.createProduct(data)
    return nuevoProducto
  } catch (error) {
    return reply.code(500).send({ error: 'Error al crear producto' })
  }
}

export const updateProduct = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const data = request.body
    const actualizado = await productRepo.updateProduct(idIncremental, data)
    if (!actualizado) {
      return reply.code(404).send({ error: 'Producto no encontrado' })
    }
    return actualizado
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: error.message })
    }
    return reply.code(500).send({ error: 'Error al actualizar producto' })
  }
}

export const deleteProduct = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const eliminado = await productRepo.deleteProduct(idIncremental)
    if (!eliminado) {
      return reply.code(404).send({ error: 'Producto no encontrado' })
    }
    return { message: 'Producto eliminado exitosamente' }
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: error.message })
    }
    return reply.code(500).send({ error: 'Error al eliminar producto' })
  }
}