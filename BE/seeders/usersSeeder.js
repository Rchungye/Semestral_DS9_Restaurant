// usersSeeder.js - Seeder de usuarios limpio con SHA-256

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../src/models/UserModel.js'
import { encryptPassword } from '../src/helpers/CryptoHelper.js'

// Cargar variables de entorno
dotenv.config()

console.log('🚀 Iniciando seeder de usuarios...')

// Verificar variables de entorno
if (!process.env.MONGO_URI) {
  console.error('❌ Error: MONGO_URI no está definida en el archivo .env')
  process.exit(1)
}

console.log('📄 MONGO_URI encontrada:', process.env.MONGO_URI)

const users = [
  // ADMINISTRADORES
  {
    name: "Carlos",
    lastName: "Administrador",
    username: "admin",
    password: "admin123",
    role: "administrador"
  },
  {
    name: "María",
    lastName: "González",
    username: "maria.admin",
    password: "maria2024",
    role: "administrador"
  },
  {
    name: "Luis",
    lastName: "Rodríguez",
    username: "luis.admin",
    password: "luis2024",
    role: "administrador"
  },

  // COCINEROS
  {
    name: "Chen",
    lastName: "Wong",
    username: "chef.chen",
    password: "chen123",
    role: "cocinero"
  },
  {
    name: "Li",
    lastName: "Zhang",
    username: "chef.li",
    password: "li123",
    role: "cocinero"
  },
  {
    name: "Ana",
    lastName: "Martínez",
    username: "chef.ana",
    password: "ana123",
    role: "cocinero"
  },
  {
    name: "Roberto",
    lastName: "Silva",
    username: "chef.roberto",
    password: "roberto123",
    role: "cocinero"
  },
  {
    name: "Diana",
    lastName: "López",
    username: "chef.diana",
    password: "diana123",
    role: "cocinero"
  }
]

async function insertarUsers() {
  try {
    console.log('🔄 Intentando conectar a MongoDB...')

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log('🟢 Conectado a MongoDB exitosamente')

    console.log('🔄 Verificando modelo User...')
    console.log('📋 Total de usuarios a insertar:', users.length)

    // Verificar sistema de encriptación
    console.log('🔐 Verificando sistema de encriptación SHA-256...')
    const testHash = encryptPassword('test123')
    console.log('✅ Sistema de encriptación funcionando correctamente')

    console.log('🗑️ Limpiando colección existente...')
    const deleteResult = await User.deleteMany()
    console.log(`🗑️ ${deleteResult.deletedCount} usuarios anteriores eliminados`)

    // Insertar usuarios
    console.log('📝 Insertando usuarios...')
    const insertedUsers = []

    for (let i = 0; i < users.length; i++) {
      const userData = users[i]
      console.log(`   📝 Insertando (${i + 1}/${users.length}): ${userData.name} ${userData.lastName} (${userData.role})`)

      try {
        // Encriptar password
        const hashedPassword = encryptPassword(userData.password)

        const userDataWithHashedPassword = {
          ...userData,
          password: hashedPassword
        }

        const newUser = new User(userDataWithHashedPassword)
        const savedUser = await newUser.save()

        // Agregar al resumen sin password
        const { password: _, ...userWithoutPassword } = savedUser.toObject()
        insertedUsers.push(userWithoutPassword)

        console.log(`   ✅ ID ${savedUser.idIncremental}: ${savedUser.username} (${savedUser.role})`)
      } catch (error) {
        console.error(`   ❌ Error insertando ${userData.username}:`, error.message)
      }
    }

    console.log(`\n✅ ${insertedUsers.length} usuarios insertados correctamente`)

    // Resumen por rol
    const roles = ['administrador', 'cocinero']
    console.log('\n📊 Resumen por rol:')

    for (const role of roles) {
      const usersByRole = insertedUsers.filter(user => user.role === role)
      console.log(`   ${role}: ${usersByRole.length} usuarios`)
      usersByRole.forEach(user => {
        console.log(`     - ID ${user.idIncremental}: ${user.username} (${user.name} ${user.lastName})`)
      })
    }

    // Credenciales de acceso
    console.log('\n🔐 Credenciales de acceso:')
    console.log('📌 ADMINISTRADORES:')
    const admins = users.filter(user => user.role === 'administrador')
    admins.forEach((user, index) => {
      const savedUser = insertedUsers.find(u => u.username === user.username)
      console.log(`   ${index + 1}. Username: ${user.username} | Password: ${user.password} | ID: ${savedUser?.idIncremental}`)
    })

    console.log('\n👨‍🍳 COCINEROS:')
    const cocineros = users.filter(user => user.role === 'cocinero')
    cocineros.forEach((user, index) => {
      const savedUser = insertedUsers.find(u => u.username === user.username)
      console.log(`   ${index + 1}. Username: ${user.username} | Password: ${user.password} | ID: ${savedUser?.idIncremental}`)
    })

    // Rango de IDs
    const ids = insertedUsers.map(user => user.idIncremental).sort((a, b) => a - b)
    console.log(`\n🔢 IDs incrementales generados: ${ids[0]} - ${ids[ids.length - 1]}`)

    console.log('\n🎉 Seeder de usuarios completado exitosamente!')
    console.log('🔒 Nota: Las contraseñas están hasheadas con SHA-256')

    await mongoose.connection.close()
    console.log('🔴 Conexión a MongoDB cerrada')

    process.exit(0)
  } catch (err) {
    console.error('\n❌ Error detallado:', err.message)
    console.error('\n🔍 Stack completo:', err.stack)
    process.exit(1)
  }
}

// Ejecutar seeder
insertarUsers()