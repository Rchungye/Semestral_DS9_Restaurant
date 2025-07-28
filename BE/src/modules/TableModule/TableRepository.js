// src/modules/TableModule/TableRepository.js
import Table from './TableModel.js'
import mongoose from 'mongoose'

export const getAllTables = async () => {
  return await Table.find()
}

export const getTableByIncrementalId = async (idIncremental) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  return await Table.findOne({ idIncremental: id })
}

export const getTableByNumber = async (tableNumber) => {
  const number = parseInt(tableNumber)
  if (isNaN(number) || number <= 0) {
    throw new Error('Table number inválido')
  }
  return await Table.findOne({ tableNumber: number })
}

// Nueva función: Obtener mesa por MongoDB ObjectId (desde QR)
export const getTableByMongoId = async (mongoId) => {
  // Validar que sea un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(mongoId)) {
    throw new Error('MongoDB ID inválido')
  }
  return await Table.findById(mongoId)
}

export const createTable = async (data) => {
  const newTable = new Table(data)
  return await newTable.save()
}

export const updateTable = async (idIncremental, data) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  delete data.idIncremental
  return await Table.findOneAndUpdate(
    { idIncremental: id },
    data,
    { new: true }
  )
}

export const deleteTable = async (idIncremental) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  const resultado = await Table.findOneAndDelete({ idIncremental: id })
  return resultado !== null
}