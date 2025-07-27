// src/repositories/TableRepository.js
import Table from '../models/TableModel.js'

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

export const getTableByQRCode = async (qrCode) => {
  return await Table.findOne({ qrCode })
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

export const getAvailableTables = async () => {
  return await Table.find({ status: 'disponible' })
}

export const getOccupiedTables = async () => {
  return await Table.find({ status: 'ocupada' })
}