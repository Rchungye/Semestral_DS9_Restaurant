// src/modules/TransactionModel.js
import mongoose from 'mongoose'
import { getNextSequence } from '../../helpers/SequenceHelper.js'

const transactionSchema = new mongoose.Schema({
  idIncremental: {
    type: Number,
    unique: true,
    index: true
  },
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
  subtotalWithoutTax: { type: Number, required: true },
  
  // Datos de la venta (anteriormente en SaleModel)
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['tarjeta']
  },
  saleDate: { type: Date, default: Date.now },
  
  // Información adicional de la transacción
  transactionId: { type: String }, // ID de la transacción de la pasarela de pago
  paymentStatus: { 
    type: String, 
    enum: ['exitoso', 'fallido', 'pendiente'], 
    default: 'exitoso' 
  }
}, { timestamps: true })

transactionSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.idIncremental = await getNextSequence('transactionid')
  }
  next()
})

const Transaction = mongoose.model("Transaction", transactionSchema)
export default Transaction