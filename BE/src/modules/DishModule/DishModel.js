// src/modules/DishModule/DishModel.js
import mongoose from 'mongoose'
import { getNextSequence } from '../../common/helpers/SequenceHelper.js'

const dishSchema = new mongoose.Schema({
  idIncremental: {
    type: Number,
    unique: true,
    index: true
  },
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  description: { type: String },
  photo: { type: String }, // URL de la imagen
  availability: { type: Boolean, default: false },
  category: { 
    type: String, 
    required: true,
    enum: ['entrada', 'plato_principal', 'bebida', 'acompañamiento']
  },
  // Campos opcionales para promociones
  hasPromotion: { type: Boolean, default: false },
  promotionPrice: { type: Number },
  promotionValidFrom: { type: Date },
  promotionValidTo: { type: Date }
}, { timestamps: true })

dishSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.idIncremental = await getNextSequence('dishid')
  }
  next()
})

const Dish = mongoose.model("Dish", dishSchema)
export default Dish