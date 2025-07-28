// src/modules/CounterModel.js
import mongoose from 'mongoose'

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
})

const Sequence = mongoose.model('Sequence', counterSchema)
export default Sequence
