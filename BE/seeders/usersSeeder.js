// usersSeeder.js - Seeder de usuarios Golden Panda

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../src/modules/UserModule/UserModel.js'
import { encryptPassword } from '../src/helpers/CryptoHelper.js'

dotenv.config()

const users = [
  // ADMINISTRADORES
  { name: "Carlos", lastName: "Administrador", username: "admin", password: "admin123", role: "administrador" },
  { name: "María", lastName: "González", username: "maria.admin", password: "maria2024", role: "administrador" },
  { name: "Luis", lastName: "Rodríguez", username: "luis.admin", password: "luis2024", role: "administrador" },

  // COCINEROS
  { name: "Chen", lastName: "Wong", username: "chef.chen", password: "chen123", role: "cocinero" },
  { name: "Li", lastName: "Zhang", username: "chef.li", password: "li123", role: "cocinero" },
  { name: "Ana", lastName: "Martínez", username: "chef.ana", password: "ana123", role: "cocinero" },
  { name: "Roberto", lastName: "Silva", username: "chef.roberto", password: "roberto123", role: "cocinero" },
  { name: "Diana", lastName: "López", username: "chef.diana", password: "diana123", role: "cocinero" }
]

export async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    await User.deleteMany()

    const insertedUsers = []
    for (const userData of users) {
      const hashedPassword = encryptPassword(userData.password)
      const newUser = new User({ ...userData, password: hashedPassword })
      const savedUser = await newUser.save()

      const { password: _, ...userWithoutPassword } = savedUser.toObject()
      insertedUsers.push(userWithoutPassword)
    }

    console.log(`✅ ${insertedUsers.length} usuarios insertados`)
    console.log(`👑 ${insertedUsers.filter(u => u.role === 'administrador').length} administradores`)
    console.log(`👨‍🍳 ${insertedUsers.filter(u => u.role === 'cocinero').length} cocineros`)

    return insertedUsers
  } catch (error) {
    console.error('❌ Error en seeder de usuarios:', error.message)
    throw error
  }
}

// Solo ejecutar directamente si es llamado como script principal
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('👥 Ejecutando seeder de usuarios...')

  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI no definida')
    process.exit(1)
  }

  try {
    await seedUsers()
    console.log('🎉 Seeder de usuarios completado')
    console.log('\n🔐 Credenciales de acceso:')
    console.log('Admin: admin / admin123')
    console.log('Chef: chef.chen / chen123')
    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}