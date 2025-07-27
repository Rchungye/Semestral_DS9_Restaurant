// src/repositories/UserRepository.js
import User from '../models/UserModel.js'

export const getAllUsers = async () => {
  return await User.find().select('-password') // No devolver passwords
}

export const getUserByIncrementalId = async (idIncremental) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  return await User.findOne({ idIncremental: id }).select('-password')
}

export const getUserByUsername = async (username) => {
  return await User.findOne({ username })
}

export const createUser = async (data) => {
  const newUser = new User(data)
  return await newUser.save()
}

export const updateUser = async (idIncremental, data) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  delete data.idIncremental
  return await User.findOneAndUpdate(
    { idIncremental: id },
    data,
    { new: true }
  ).select('-password')
}

export const deleteUser = async (idIncremental) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  const resultado = await User.findOneAndDelete({ idIncremental: id })
  return resultado !== null
}

// Función específica para autenticación (incluye password)
export const getUserForAuth = async (username) => {
  return await User.findOne({ username }) // Incluye password para verificación
}