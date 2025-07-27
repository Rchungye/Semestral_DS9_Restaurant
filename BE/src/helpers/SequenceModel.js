// src/models/CounterModel.js
import mongoose from 'mongoose'

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // nombre del contador, ej: 'productid'
  seq: { type: Number, default: 0 }
})

const Sequence = mongoose.model('Sequence', counterSchema)
export default Sequence
