// src/services/TableServices.js
import * as tableRepo from '../repositories/TableRepository.js'

export const listTables = async (request, reply) => {
  try {
    const tables = await tableRepo.getAllTables()
    return tables
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving tables' })
  }
}

export const getTable = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const table = await tableRepo.getTableByIncrementalId(idIncremental)
    if (!table) {
      return reply.code(404).send({ error: 'Table not found' })
    }
    return table
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    return reply.code(500).send({ error: 'Error retrieving table' })
  }
}

export const getTableByNumber = async (request, reply) => {
  try {
    const tableNumber = request.params.number
    const table = await tableRepo.getTableByNumber(tableNumber)
    if (!table) {
      return reply.code(404).send({ error: 'Table not found' })
    }
    return table
  } catch (error) {
    if (error.message === 'Table number inválido') {
      return reply.code(400).send({ error: 'Invalid table number' })
    }
    return reply.code(500).send({ error: 'Error retrieving table' })
  }
}

// Función actualizada para obtener mesa por MongoDB ID (desde QR)
export const getTableByQR = async (request, reply) => {
  try {
    const mongoId = request.params.qr // El QR ahora contiene el MongoDB _id
    const table = await tableRepo.getTableByMongoId(mongoId)
    if (!table) {
      return reply.code(404).send({ error: 'Table not found for this QR code' })
    }
    return table
  } catch (error) {
    if (error.message === 'MongoDB ID inválido') {
      return reply.code(400).send({ error: 'Invalid QR code format' })
    }
    return reply.code(500).send({ error: 'Error retrieving table by QR' })
  }
}

export const createTable = async (request, reply) => {
  try {
    const data = request.body

    // Validar campos obligatorios
    if (!data.tableNumber) {
      return reply.code(400).send({ error: 'Missing required field: tableNumber' })
    }

    // Verificar que el número de mesa no exista
    const existingTable = await tableRepo.getTableByNumber(data.tableNumber)
    if (existingTable) {
      return reply.code(409).send({ error: 'Table number already exists' })
    }

    const newTable = await tableRepo.createTable(data)
    return reply.code(201).send(newTable)
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.tableNumber) {
        return reply.code(409).send({ error: 'Table number already exists' })
      }
    }
    return reply.code(500).send({ error: 'Error creating table' })
  }
}

export const updateTable = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const data = request.body

    const updatedTable = await tableRepo.updateTable(idIncremental, data)
    if (!updatedTable) {
      return reply.code(404).send({ error: 'Table not found' })
    }
    return updatedTable
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    if (error.code === 11000) {
      if (error.keyPattern.tableNumber) {
        return reply.code(409).send({ error: 'Table number already exists' })
      }
    }
    return reply.code(500).send({ error: 'Error updating table' })
  }
}

export const deleteTable = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const deleted = await tableRepo.deleteTable(idIncremental)
    if (!deleted) {
      return reply.code(404).send({ error: 'Table not found' })
    }
    return reply.code(200).send({
      message: 'Table deleted successfully',
      id: parseInt(idIncremental)
    })
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    return reply.code(500).send({ error: 'Error deleting table' })
  }
}