// src/helpers/CryptoHelper.js
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

// Llaves RSA cortas para desarrollo (1024 bits)
const RSA_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQC8Q7HgL8R2p1wF2n8Y9k5K3mF7nQ9Y8jK1nX5tF3vG2d8C4nV1
mE8P9qL2sT7wJ3uK5yH6pN9bM8vR4xT1fS2aE7cQ6rW3eD8gH2jL5nP9vC1bK3dF
6sG7hI8jL2kM3nO4pQ5rS6tU7vW8xY9zA1bC2dE3fG4hI5jK6lM7nO8pQ9rSwIDAQAB
AoGAFkS7H3l8M2nP4qR5sT6uV7wX8yZ9A0bC1dE2fF3gH4iJ5kL6mN7oP8qR9sT0
uV1wX2yZ3A4bC5dE6fF7gH8iJ9kL0mN1oP2qR3sT4uV5wX6yZ7A8bC9dE0fF1gH2i
J3kL4mN5oP6qR7sT8uV9wX0yZ1A2bC3dE4fF5gH6iJ7kL8mN9oP0qR1sT2uV3wECQQD
fF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3A4bC5dE6fF7gH8iJ9kL0mN1oP2qR3sT4u
V5wX6yZ7A8bC9dE0fF1gECQQC8Q7HgL8R2p1wF2n8Y9k5K3mF7nQ9Y8jK1nX5tF3vG
2d8C4nV1mE8P9qL2sT7wJ3uK5yH6pN9bM8vR4xT1fS2aAkEA2fF3gH4iJ5kL6mN7oP
8qR9sT0uV1wX2yZ3A4bC5dE6fF7gH8iJ9kL0mN1oP2qR3sT4uV5wX6yZ7A8bC9dE0fF
-----END RSA PRIVATE KEY-----`

const RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8Q7HgL8R2p1wF2n8Y9k5K3mF7
nQ9Y8jK1nX5tF3vG2d8C4nV1mE8P9qL2sT7wJ3uK5yH6pN9bM8vR4xT1fS2aE7cQ
6rW3eD8gH2jL5nP9vC1bK3dF6sG7hI8jL2kM3nO4pQ5rS6tU7vW8xY9zA1bC2dE3
fG4hI5jK6lM7nO8pQ9rSwIDAQAB
-----END PUBLIC KEY-----`

const JWT_SECRET = 'golden-panda-secret-key-2024'

// Encriptar password con RSA
export const encryptPassword = (password) => {
  try {
    const encrypted = crypto.publicEncrypt(
      {
        key: RSA_PUBLIC_KEY,
        padding: crypto.constants.RSA_PKCS1_PADDING
      },
      Buffer.from(password, 'utf8')
    )
    return encrypted.toString('base64')
  } catch (error) {
    throw new Error('Error encrypting password')
  }
}

// Desencriptar password con RSA
export const decryptPassword = (encryptedPassword) => {
  try {
    const decrypted = crypto.privateDecrypt(
      {
        key: RSA_PRIVATE_KEY,
        padding: crypto.constants.RSA_PKCS1_PADDING
      },
      Buffer.from(encryptedPassword, 'base64')
    )
    return decrypted.toString('utf8')
  } catch (error) {
    throw new Error('Error decrypting password')
  }
}

// Generar JWT token
export const generateToken = (user) => {
  const payload = {
    id: user.idIncremental,
    username: user.username,
    role: user.role,
    name: user.name,
    lastName: user.lastName
  }
  
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '8h' // Token expira en 8 horas
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

// Comparar passwords (útil para login)
export const comparePasswords = (plainPassword, encryptedPassword) => {
  try {
    const decryptedPassword = decryptPassword(encryptedPassword)
    return plainPassword === decryptedPassword
  } catch (error) {
    return false
  }
}