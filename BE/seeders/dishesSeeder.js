// dishesSeeder.js - VERSIÓN ARREGLADA

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Dish from '../src/models/DishModel.js'

// Cargar variables de entorno
dotenv.config()

console.log('🚀 Iniciando seeder de platillos...')

// Verificar variables de entorno
if (!process.env.MONGO_URI) {
  console.error('❌ Error: MONGO_URI no está definida en el archivo .env')
  process.exit(1)
}

console.log('📄 MONGO_URI encontrada:', process.env.MONGO_URI)

const dishes = [
  // ENTRADAS
  {
    name: "Siu Mai",
    description: "4 piezas · Puerco y Camarón - Tradicional dim sum cantonés con textura jugosa",
    price: 4.99,
    photo: "https://images.squarespace-cdn.com/content/v1/51f7fb1ee4b03d20c9b4c34b/1376340296181-YWXEZXB9NTE9JQQ6BBPB/shu-mai.jpg",
    category: "entrada",
    availability: true,
    hasPromotion: false
  },
  {
    name: "Hakao",
    description: "4 piezas · Empanaditas de Camarón - Delicados dumplings translúcidos",
    price: 5.50,
    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpyE0H-gVsbYZ7uy0Z31Z3uUkMeemgTPAweg&s",
    category: "entrada",
    availability: true,
    hasPromotion: true,
    promotionPrice: 4.99,
    promotionValidFrom: new Date('2024-01-15'),
    promotionValidTo: new Date('2024-12-31')
  },
  {
    name: "Rollitos Primavera",
    description: "4 piezas · Vegetales frescos envueltos, crujientes y dorados",
    price: 3.75,
    photo: "https://content-cocina.lecturas.com/medio/2022/03/03/rollitos-de-primavera-con-carne-y-salsa-de-soja_00000000_240402112349_1200x1200.jpg",
    category: "entrada",
    availability: true,
    hasPromotion: false
  },
  {
    name: "Wonton Frito",
    description: "6 piezas · Crujientes wontons rellenos de camarón y cerdo",
    price: 6.25,
    photo: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop",
    category: "entrada",
    availability: true,
    hasPromotion: false
  },

  // PLATOS PRINCIPALES
  {
    name: "Pato Laqueado",
    description: "Porción individual · Pato glaseado con salsa hoisin y cebollín",
    price: 12.99,
    photo: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop",
    category: "plato_principal",
    availability: true,
    hasPromotion: false
  },
  {
    name: "Chow Mein de Pollo",
    description: "Tallarines salteados con pollo, vegetales frescos y salsa de soja",
    price: 9.99,
    photo: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    category: "plato_principal",
    availability: true,
    hasPromotion: true,
    promotionPrice: 8.99,
    promotionValidFrom: new Date('2024-02-01'),
    promotionValidTo: new Date('2024-02-29')
  },
  {
    name: "Arroz Frito Golden Panda",
    description: "Arroz frito con camarones, pollo, huevo y vegetales mixtos",
    price: 8.75,
    photo: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    category: "plato_principal",
    availability: true,
    hasPromotion: false
  },
  {
    name: "Pollo Agridulce",
    description: "Trozos de pollo empanizado con salsa agridulce y piña",
    price: 10.50,
    photo: "https://www.recetasnestle.com.do/sites/default/files/styles/recipe_detail_desktop_new/public/srh_recipes/cac5ab3885002b6ead9d202fcf7ee64e.webp?itok=p-Np4zS9",
    category: "plato_principal",
    availability: true,
    hasPromotion: false
  },

  // BEBIDAS
  {
    name: "Té Verde Jasmine",
    description: "Té verde aromático con flores de jazmín",
    price: 2.50,
    photo: "https://puntodete.com/img/cms/blog/POST/te%20de%20jazmin/flor-de-té-ben-4%202.jpg",
    category: "bebida",
    availability: true,
    hasPromotion: false
  },
  {
    name: "Té Oolong Premium",
    description: "Té tradicional chino con sabor suave y aromático",
    price: 3.25,
    photo: "https://sakiproducts.com/cdn/shop/articles/20221031112901-oolong-tea-recipe_98aeef4f-4c3e-4958-a358-0fbf28eddb72_1920x1080.jpg?v=1667216317",
    category: "bebida",
    availability: true,
    hasPromotion: true,
    promotionPrice: 2.75,
    promotionValidFrom: new Date('2024-01-01'),
    promotionValidTo: new Date('2024-03-31')
  },

  // ACOMPAÑAMIENTOS
  {
    name: "Arroz Blanco Jazmín",
    description: "Arroz jazmín cocido al vapor, perfecto acompañamiento",
    price: 2.25,
    photo: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    category: "acompañamiento",
    availability: true,
    hasPromotion: false
  },
  {
    name: "Vegetales Salteados",
    description: "Mix de vegetales frescos salteados con ajo y jengibre",
    price: 4.50,
    photo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    category: "acompañamiento",
    availability: true,
    hasPromotion: false
  },
  {
    name: "Chee Cheong Fun",
    description: "3 rollos · Rollos de Arroz con Puerco - Suaves láminas de arroz rellenas",
    price: 4.50,
    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN-s-9FjeDBAXslrP4g4tqFmCu5ZaEm3TA5Q&s",
    category: "acompañamiento",
    availability: true,
    hasPromotion: false
  }
]

async function insertarDishes() {
  try {
    console.log('🔄 Intentando conectar a MongoDB...')
    
    // Conectar a MongoDB (removemos las opciones deprecated)
    await mongoose.connect(process.env.MONGO_URI)
    console.log('🟢 Conectado a MongoDB exitosamente')

    console.log('🔄 Verificando modelo Dish...')
    console.log('📋 Total de platillos a insertar:', dishes.length)

    console.log('🗑️ Limpiando colección existente...')
    const deleteResult = await Dish.deleteMany()
    console.log(`🗑️ ${deleteResult.deletedCount} platillos anteriores eliminados`)

    // SOLUCIÓN: Insertar uno por uno para que se ejecute el middleware pre('save')
    console.log('📝 Insertando platillos uno por uno...')
    const insertedDishes = []
    
    for (let i = 0; i < dishes.length; i++) {
      const dishData = dishes[i]
      console.log(`   📝 Insertando (${i + 1}/${dishes.length}): ${dishData.name}`)
      
      try {
        const newDish = new Dish(dishData)
        const savedDish = await newDish.save()
        insertedDishes.push(savedDish)
        console.log(`   ✅ ID ${savedDish.idIncremental}: ${savedDish.name}`)
      } catch (error) {
        console.error(`   ❌ Error insertando ${dishData.name}:`, error.message)
      }
    }

    console.log(`\n✅ ${insertedDishes.length} platillos insertados correctamente`)

    // Mostrar resumen por categoría
    const categorias = ['entrada', 'plato_principal', 'bebida', 'acompañamiento']
    console.log('\n📊 Resumen por categoría:')
    
    for (const categoria of categorias) {
      const count = insertedDishes.filter(dish => dish.category === categoria).length
      console.log(`   ${categoria}: ${count} platillos`)
    }

    // Mostrar platillos con promoción
    const conPromocion = insertedDishes.filter(dish => dish.hasPromotion === true)
    console.log(`\n🎁 Platillos con promoción: ${conPromocion.length}`)
    conPromocion.forEach(dish => {
      console.log(`   - ID ${dish.idIncremental}: ${dish.name}: $${dish.price} → $${dish.promotionPrice}`)
    })

    // Mostrar rango de IDs incrementales generados
    const ids = insertedDishes.map(dish => dish.idIncremental).sort((a, b) => a - b)
    console.log(`\n🔢 IDs incrementales generados: ${ids[0]} - ${ids[ids.length - 1]}`)

    console.log('\n🎉 Seeder completado exitosamente!')
    
    await mongoose.connection.close()
    console.log('🔴 Conexión a MongoDB cerrada')
    
    process.exit(0)
  } catch (err) {
    console.error('\n❌ Error detallado:', err.message)
    
    if (err.name === 'MongooseError') {
      console.error('🔍 Error de Mongoose - verifica tu modelo o conexión')
    }
    
    if (err.code === 'ENOTFOUND') {
      console.error('🌐 Error de red - verifica tu conexión a internet o URL de MongoDB')
    }
    
    process.exit(1)
  }
}

// Ejecutar solo si se llama directamente
insertarDishes()