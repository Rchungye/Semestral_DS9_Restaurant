// src/services/UserServices.js
import * as userRepo from '../repositories/UserRepository.js'
import { 
  encryptPassword, 
  comparePasswords, 
  generateToken 
} from '../helpers/CryptoHelper.js'

// ============= AUTENTICACIÓN =============

export const login = async (request, reply) => {
  try {
    const { username, password } = request.body
    
    if (!username || !password) {
      return reply.code(400).send({ 
        error: 'Username and password are required' 
      })
    }

    // Buscar usuario con password incluido
    const user = await userRepo.getUserForAuth(username)
    if (!user) {
      return reply.code(401).send({ 
        error: 'Invalid credentials' 
      })
    }

    // Verificar password
    const isValidPassword = comparePasswords(password, user.password)
    if (!isValidPassword) {
      return reply.code(401).send({ 
        error: 'Invalid credentials' 
      })
    }

    // Generar token JWT
    const token = generateToken(user)

    // Respuesta exitosa sin incluir password
    const { password: _, ...userWithoutPassword } = user.toObject()
    
    return reply.code(200).send({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
      expiresIn: '8h'
    })

  } catch (error) {
    console.error('Login error:', error)
    return reply.code(500).send({ 
      error: 'Internal server error during login' 
    })
  }
}

export const logout = async (request, reply) => {
  try {
    // En JWT no hay logout real en el servidor, pero podemos dar una respuesta
    return reply.code(200).send({
      message: 'Logout successful',
      note: 'Token invalidated on client side'
    })
  } catch (error) {
    return reply.code(500).send({ 
      error: 'Error during logout' 
    })
  }
}

// ============= CRUD USUARIOS =============

export const listUsers = async (request, reply) => {
  try {
    const users = await userRepo.getAllUsers()
    return users
  } catch (error) {
    return reply.code(500).send({ error: 'Error retrieving users' })
  }
}

export const getUser = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const user = await userRepo.getUserByIncrementalId(idIncremental)
    if (!user) {
      return reply.code(404).send({ error: 'User not found' })
    }
    return user
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    return reply.code(500).send({ error: 'Error retrieving user' })
  }
}

export const createUser = async (request, reply) => {
  try {
    const data = request.body
    
    // Validar campos obligatorios
    if (!data.name || !data.lastName || !data.username || !data.password || !data.role) {
      return reply.code(400).send({ 
        error: 'Missing required fields: name, lastName, username, password, role' 
      })
    }

    // Verificar que el username no exista
    const existingUser = await userRepo.getUserByUsername(data.username)
    if (existingUser) {
      return reply.code(409).send({ 
        error: 'Username already exists' 
      })
    }

    // Encriptar password
    data.password = encryptPassword(data.password)

    // Crear usuario
    const newUser = await userRepo.createUser(data)
    
    // Responder sin password
    const { password: _, ...userWithoutPassword } = newUser.toObject()
    
    return reply.code(201).send(userWithoutPassword)
  } catch (error) {
    if (error.code === 11000) {
      return reply.code(409).send({ error: 'Username already exists' })
    }
    return reply.code(500).send({ error: 'Error creating user' })
  }
}

export const updateUser = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const data = request.body

    // Si se está actualizando la password, encriptarla
    if (data.password) {
      data.password = encryptPassword(data.password)
    }

    const updatedUser = await userRepo.updateUser(idIncremental, data)
    if (!updatedUser) {
      return reply.code(404).send({ error: 'User not found' })
    }
    
    return updatedUser
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    if (error.code === 11000) {
      return reply.code(409).send({ error: 'Username already exists' })
    }
    return reply.code(500).send({ error: 'Error updating user' })
  }
}

export const deleteUser = async (request, reply) => {
  try {
    const idIncremental = request.params.id
    const deleted = await userRepo.deleteUser(idIncremental)
    if (!deleted) {
      return reply.code(404).send({ error: 'User not found' })
    }
    return reply.code(200).send({ 
      message: 'User deleted successfully',
      id: parseInt(idIncremental)
    })
  } catch (error) {
    if (error.message === 'ID incremental inválido') {
      return reply.code(400).send({ error: 'Invalid incremental ID' })
    }
    return reply.code(500).send({ error: 'Error deleting user' })
  }
}