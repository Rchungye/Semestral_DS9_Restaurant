import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  imagen: { type: String },
  categoria: { type: String },
  etiquetas: [String],
  tiempo: { type: String },
  rating: { type: Number }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;