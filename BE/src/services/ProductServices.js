// src/controllers/ProductController.js
import * as productRepo from '../repositories/ProductRepository.js'

export const listProducts = async (request, reply) => {
  const productos = await productRepo.getAllProducts()
  return productos
}

export const getProduct = async (request, reply) => {
  const producto = await productRepo.getProductById(request.params.id)
  if (!producto) return reply.status(404).send({ error: 'Producto no encontrado' })
  return producto
}

export const createProduct = async (request, reply) => {
  const data = request.body
  if (!data.nombre || data.precio == null || !data.categoria) {
    return reply.status(400).send({ error: 'Faltan campos obligatorios' })
  }
  const nuevoProducto = await productRepo.createProduct(data)
  return reply.status(201).send(nuevoProducto)
}

export const updateProduct = async (request, reply) => {
  const id = request.params.id
  const data = request.body
  const actualizado = await productRepo.updateProduct(id, data)
  if (!actualizado) return reply.status(404).send({ error: 'Producto no encontrado' })
  return actualizado
}

export const deleteProduct = async (request, reply) => {
  const id = request.params.id
  const eliminado = await productRepo.deleteProduct(id)
  if (!eliminado) return reply.status(404).send({ error: 'Producto no encontrado' })
  return { message: 'Producto eliminado exitosamente' }
}
