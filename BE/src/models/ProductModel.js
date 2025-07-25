// src/models/ProductModel.js

const mongoose = require("mongoose");

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

module.exports = mongoose.model("Product", productSchema);
