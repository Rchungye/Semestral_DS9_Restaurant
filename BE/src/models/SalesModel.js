// src/models/SaleModel.js
import mongoose from 'mongoose'
import { getNextSequence } from '../helpers/SequenceHelper.js'

const saleSchema = new mongoose.Schema({
  idIncremental: {
    type: Number,
    unique: true,
    index: true
  },
  billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['tarjeta']
  },
  amount: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
  
  // Información adicional de la transacción
  transactionId: { type: String }, // ID de la transacción de la pasarela de pago
  cardLastFourDigits: { type: String }, // Últimos 4 dígitos de la tarjeta
  paymentStatus: { 
    type: String, 
    enum: ['exitoso', 'fallido', 'pendiente'], 
    default: 'exitoso' 
  }
}, { timestamps: true })

saleSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.idIncremental = await getNextSequence('saleid')
  }
  next()
})

const Sale = mongoose.model("Sale", saleSchema)
export default Sale