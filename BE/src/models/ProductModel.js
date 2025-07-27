// src/models/ProductModel.js
import mongoose from "mongoose"
import { getNextSequence } from '../helpers/SequenceHelper.js'

const productSchema = new mongoose.Schema({
  idIncremental: {
    type: Number,
    unique: true,
    index: true
  },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  imagen: { type: String },
  categoria: { type: String },
  etiquetas: [String],
  tiempo: { type: String },
  rating: { type: Number }
}, { timestamps: true });

productSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.idIncremental = await getNextSequence('productid')
  }
  next()
})

const Product = mongoose.model("Product", productSchema)
export default Product