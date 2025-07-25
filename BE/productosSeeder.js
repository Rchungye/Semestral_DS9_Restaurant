// productosSeeder.js

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './src/models/ProductModel.js'

dotenv.config()

const productos = [
  {
    nombre: "Siu mai",
    descripcion: "4 piezas · Puerco y Camarón - Tradicional dim sum cantonés con textura jugosa",
    precio: 4,
    imagen: "https://images.squarespace-cdn.com/content/v1/51f7fb1ee4b03d20c9b4c34b/1376340296181-YWXEZXB9NTE9JQQ6BBPB/shu-mai.jpg",
    categoria: "dim-sum",
    etiquetas: ["popular", "tradicional"],
    tiempo: "15 min",
    rating: 4.8
  },
  {
    nombre: "Hakao",
    descripcion: "4 piezas · Empanaditas de Camarón - Delicados dumplings translúcidos",
    precio: 5.50,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpyE0H-gVsbYZ7uy0Z31Z3uUkMeemgTPAweg&s",
    categoria: "dim-sum",
    etiquetas: ["premium", "especial"],
    tiempo: "12 min",
    rating: 4.9
  },
  {
    nombre: "Chee Cheong Fun",
    descripcion: "3 rollos · Rollos de Arroz con Puerco - Suaves láminas de arroz rellenas",
    precio: 4.50,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN-s-9FjeDBAXslrP4g4tqFmCu5ZaEm3TA5Q&s",
    categoria: "dim-sum",
    etiquetas: ["veggie-friendly", "ligero"],
    tiempo: "10 min",
    rating: 4.6
  },
  {
    nombre: "Wonton Frito",
    descripcion: "6 piezas · Crujientes wontons rellenos de camarón y cerdo",
    precio: 6.25,
    imagen: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop",
    categoria: "fritos",
    etiquetas: ["crujiente", "popular"],
    tiempo: "8 min",
    rating: 4.7
  },
  {
    nombre: "Rollitos Primavera con Carne",
    descripcion: "4 piezas · Vegetales frescos envueltos, opción vegetariana",
    precio: 3.75,
    imagen: "https://content-cocina.lecturas.com/medio/2022/03/03/rollitos-de-primavera-con-carne-y-salsa-de-soja_00000000_240402112349_1200x1200.jpg",
    categoria: "dim-sum",
    etiquetas: ["saludable", "eco"],
    tiempo: "5 min",
    rating: 4.4
  },
  {
    nombre: "Pato Laqueado",
    descripcion: "Porción individual · Pato glaseado con salsa hoisin y cebollín",
    precio: 12.99,
    imagen: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop",
    categoria: "premium",
    etiquetas: ["premium", "especial"],
    tiempo: "25 min",
    rating: 4.9
  }
]

async function insertarProductos() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('🟢 Conectado a MongoDB')

    await Product.deleteMany()
    console.log('🗑️ Productos anteriores eliminados')

    await Product.insertMany(productos)
    console.log('✅ Productos insertados correctamente')

    process.exit()
  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  }
}

insertarProductos()
