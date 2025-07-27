// src/models/PromotionModel.js
import mongoose from 'mongoose'
import { getNextSequence } from '../helpers/SequenceHelper.js'

const promotionSchema = new mongoose.Schema({
  idIncremental: {
    type: Number,
    unique: true,
    index: true
  },
  name: { type: String, required: true },
  description: { type: String },
  discountType: { 
    type: String, 
    enum: ['porcentaje', 'monto_fijo'], 
    required: true 
  },
  discountValue: { type: Number, required: true }, // Porcentaje o monto
  
  // Aplicabilidad
  applicableToCategories: [{ 
    type: String,
    enum: ['entrada', 'plato_principal', 'bebida', 'acompañamiento']
  }],
  
  // Vigencia
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  
  // Días de la semana aplicables (0=Domingo, 6=Sábado)
  validDays: [{ type: Number, min: 0, max: 6 }],
  
  isActive: { type: Boolean, default: true },
  currentUses: { type: Number, default: 0 }
}, { timestamps: true })

promotionSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.idIncremental = await getNextSequence('promotionid')
  }
  next()
})

const Promotion = mongoose.model("Promotion", promotionSchema)
export default Promotion