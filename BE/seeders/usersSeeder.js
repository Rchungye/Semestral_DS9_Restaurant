import mongoose from 'mongoose'
import dotenv from 'dotenv'
import crypto from 'crypto'
import User from '../src/models/UserModel.js'

// Cargar variables de entorno
dotenv.config()

console.log('🚀 Iniciando seeder de usuarios (versión corregida)...')

// Verificar variables de entorno
if (!process.env.MONGO_URI) {
  console.error('❌ Error: MONGO_URI no está definida en el archivo .env')
  process.exit(1)
}

console.log('📄 MONGO_URI encontrada:', process.env.MONGO_URI)

// Función alternativa de encriptación usando SHA-256
const hashPassword = (password) => {
  try {
    const salt = 'golden-panda-salt-2024' // Salt fijo para desarrollo
    return crypto.createHash('sha256').update(password + salt).digest('hex')
  } catch (error) {
    throw new Error('Error hashing password with SHA-256')
  }
}

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

    // Verificar que el sistema de hash funciona
    console.log('🔐 Verificando sistema de hash SHA-256...')
    try {
      const testPassword = "test123"
      const hashed = hashPassword(testPassword)
      console.log('✅ Sistema de hash SHA-256 funcionando correctamente')
      console.log(`📝 Hash de prueba: ${hashed.substring(0, 16)}...`)
    } catch (hashError) {
      console.error('❌ Error en sistema de hash:', hashError.message)
      throw hashError
    }

    console.log('🗑️ Limpiando colección existente...')
    const deleteResult = await User.deleteMany()
    console.log(`🗑️ ${deleteResult.deletedCount} usuarios anteriores eliminados`)

    // Insertar usuarios uno por uno para que se ejecute el middleware pre('save')
    console.log('📝 Insertando usuarios uno por uno...')
    const insertedUsers = []
    
    for (let i = 0; i < users.length; i++) {
      const userData = users[i]
      console.log(`   📝 Insertando (${i + 1}/${users.length}): ${userData.name} ${userData.lastName} (${userData.role})`)
      
      try {
        // Hash de password usando SHA-256
        const hashedPassword = hashPassword(userData.password)
        console.log(`   🔒 Password hasheada para ${userData.username}`)
        
        const userDataWithHashedPassword = {
          ...userData,
          password: hashedPassword
        }
        
        const newUser = new User(userDataWithHashedPassword)
        const savedUser = await newUser.save()
        
        // Agregar el usuario sin password para el resumen
        const { password: _, ...userWithoutPassword } = savedUser.toObject()
        insertedUsers.push(userWithoutPassword)
        
        console.log(`   ✅ ID ${savedUser.idIncremental}: ${savedUser.username} (${savedUser.role})`)
      } catch (error) {
        console.error(`   ❌ Error insertando ${userData.username}:`, error.message)
        console.error(`   📋 Stack del error:`, error.stack)
      }
    }

    console.log(`\n✅ ${insertedUsers.length} usuarios insertados correctamente`)

    // Mostrar resumen por rol
    const roles = ['administrador', 'cocinero']
    console.log('\n📊 Resumen por rol:')
    
    for (const role of roles) {
      const count = insertedUsers.filter(user => user.role === role).length
      const usersByRole = insertedUsers.filter(user => user.role === role)
      console.log(`   ${role}: ${count} usuarios`)
      usersByRole.forEach(user => {
        console.log(`     - ID ${user.idIncremental}: ${user.username} (${user.name} ${user.lastName})`)
      })
    }

    // Mostrar información de acceso
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

    // Mostrar rango de IDs incrementales generados
    const ids = insertedUsers.map(user => user.idIncremental).sort((a, b) => a - b)
    console.log(`\n🔢 IDs incrementales generados: ${ids[0]} - ${ids[ids.length - 1]}`)

    console.log('\n🎉 Seeder de usuarios completado exitosamente!')
    console.log('🔒 Nota: Las contraseñas están hasheadas con SHA-256 en la base de datos')
    console.log('⚠️ IMPORTANTE: Actualiza tu CryptoHelper.js para usar SHA-256 o arregla el sistema RSA')
    
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
    
    if (err.message.includes('hash')) {
      console.error('🔒 Error de hash - verifica la función hashPassword')
    }
    
    console.error('\n🔍 Stack completo:', err.stack)
    
    process.exit(1)
  }
}

// Ejecutar solo si se llama directamente
insertarUsers()