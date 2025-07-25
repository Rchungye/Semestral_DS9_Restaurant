// src/repositories/ProductRepository.js
import Product from '../models/ProductModel.js'

export const getAllProducts = async () => {
  return await Product.find()
}

export const getProductById = async (id) => {
  return await Product.findById(id)
}

export const createProduct = async (data) => {
  const nuevoProducto = new Product(data)
  return await nuevoProducto.save()
}

export const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true })
}

export const deleteProduct = async (id) => {
  const resultado = await Product.findByIdAndDelete(id)
  return resultado !== null
}
