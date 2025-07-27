// src/models/TableModel.js
import mongoose from 'mongoose'
import { getNextSequence } from '../helpers/SequenceHelper.js'

const tableSchema = new mongoose.Schema({
  idIncremental: {
    type: Number,
    unique: true,
    index: true
  },
  tableNumber: { type: Number, required: true, unique: true },
  qrCode: { type: String, unique: true }, // Código QR único para la mesa
  capacity: { type: Number, default: 4 } // Capacidad de personas
}, { timestamps: true })

tableSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.idIncremental = await getNextSequence('tableid')
  }
  next()
})

const Table = mongoose.model("Table", tableSchema)
export default Table