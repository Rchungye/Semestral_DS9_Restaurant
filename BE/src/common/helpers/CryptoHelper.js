// src/common/helpers/CryptoHelper.js - Versión limpia con solo SHA-256

import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

// Verificar que las variables de entorno estén definidas
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definida en el archivo .env')
}

if (!process.env.CRYPTO_SALT) {
  throw new Error('CRYPTO_SALT no está definida en el archivo .env')
}

const JWT_SECRET = process.env.JWT_SECRET
const SALT = process.env.CRYPTO_SALT

// ============= FUNCIONES DE HASH =============

// Hashear password con SHA-256
export const encryptPassword = (password) => {
  try {
    return crypto.createHash('sha256').update(password + SALT).digest('hex')
  } catch (error) {
    throw new Error('Error hashing password')
  }
}

// Alias para mantener compatibilidad
export const hashPassword = encryptPassword

// Comparar passwords
export const comparePasswords = (plainPassword, hashedPassword) => {
  try {
    const hashedPlainPassword = encryptPassword(plainPassword)
    return hashedPlainPassword === hashedPassword
  } catch (error) {
    console.error('Password comparison failed:', error.message)
    return false
  }
}

// ============= FUNCIONES JWT =============

// Generar JWT token
export const generateToken = (user) => {
  const payload = {
    id: user.idIncremental,
    username: user.username,
    role: user.role,
    name: user.name,
    lastName: user.lastName
  }
  
  // Usar variable de entorno para expiración o valor por defecto
  const expiresIn = process.env.JWT_EXPIRES_IN || '8h'
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn // Token expira según configuración
  })
}

// Verificar JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// ============= FUNCIONES AUXILIARES =============

// Verificar si un hash es válido (para debugging)
export const isValidHash = (hash) => {
  return typeof hash === 'string' && hash.length === 64 // SHA-256 produce 64 caracteres hex
}

// Generar hash de prueba (para testing)
export const generateTestHash = (testString = 'test123') => {
  return encryptPassword(testString)
}