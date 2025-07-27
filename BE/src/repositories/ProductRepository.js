// src/repositories/ProductRepository.js
import Product from '../models/ProductModel.js'

export const getAllProducts = async () => {
  return await Product.find()
}

export const getProductByIncrementalId = async (idIncremental) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  return await Product.findOne({ idIncremental: id })
}

export const createProduct = async (data) => {
  const nuevoProducto = new Product(data)
  return await nuevoProducto.save()
}

export const updateProduct = async (idIncremental, data) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  delete data.idIncremental
  return await Product.findOneAndUpdate(
    { idIncremental: id },
    data,
    { new: true }
  )
}

export const deleteProduct = async (idIncremental) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  const resultado = await Product.findOneAndDelete({ idIncremental: id })
  return resultado !== null
}