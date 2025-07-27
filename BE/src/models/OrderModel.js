// src/models/OrderModel.js
import mongoose from 'mongoose'
import { getNextSequence } from '../helpers/SequenceHelper.js'

const orderSchema = new mongoose.Schema({
  idIncremental: {
    type: Number,
    unique: true,
    index: true
  },
  orderDate: { type: Date, default: Date.now },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true }, // Incluye impuestos si aplica
  type: { 
    type: String, 
    enum: ['local', 'takeout'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pendiente', 'preparando', 'finalizado', 'entregado', 'cancelado'], 
    default: 'pendiente' 
  },
  
  // Para pedidos locales
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  
  // Para pedidos takeout - datos del cliente
  customerName: { type: String },
  customerEmail: { type: String }, // Para enviar factura
  invoiceNumber: { type: String }, // Número de factura
  
  // Notas adicionales
  notes: { type: String },
}, { timestamps: true })

orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.idIncremental = await getNextSequence('orderid')
    
    // Generar número de factura para takeout
    if (this.type === 'takeout') {
      const invoiceSeq = await getNextSequence('invoicenumber')
      this.invoiceNumber = `FAC-${String(invoiceSeq).padStart(6, '0')}`
    }
  }
  next()
})

const Order = mongoose.model("Order", orderSchema)
export default Order