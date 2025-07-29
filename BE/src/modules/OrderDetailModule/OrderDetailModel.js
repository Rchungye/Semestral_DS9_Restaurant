// src/modules/OrderDetailModule/OrderDetailModel.js
import mongoose from 'mongoose'
import { getNextSequence } from '../../common/helpers/SequenceHelper.js'

const orderDetailSchema = new mongoose.Schema({
  idIncremental: {
    type: Number,
    unique: true,
    index: true
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true }, // Precio al momento del pedido
  subtotal: { type: Number, required: true }, // quantity * unitPrice
  
  // Personalizaciones del platillo
  specialInstructions: { type: String } // Observaciones del cliente
}, { timestamps: true })

orderDetailSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.idIncremental = await getNextSequence('orderdetailid')
    // Calcular subtotal automáticamente
    this.subtotal = this.quantity * this.unitPrice
  }
  next()
})

const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema)
export default OrderDetail