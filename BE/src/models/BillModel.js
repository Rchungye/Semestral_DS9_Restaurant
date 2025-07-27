// src/models/BillModel.js
import mongoose from 'mongoose'
import { getNextSequence } from '../helpers/SequenceHelper.js'

const billSchema = new mongoose.Schema({
  idIncremental: {
    type: Number,
    unique: true,
    index: true
  },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pendiente', 'pagada', 'cancelada'], 
    default: 'pendiente' 
  },
  paymentDate: { type: Date, default: Date.now },
  
  // Datos fiscales
  taxAmount: { type: Number, default: 0 }, // ITBMS u otros impuestos
  subtotalWithoutTax: { type: Number, required: true }
}, { timestamps: true })

billSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.idIncremental = await getNextSequence('billid')
  }
  next()
})

const Bill = mongoose.model("Bill", billSchema)
export default Bill