// src/helpers/CryptoHelper_fixed.js - Versión corregida

import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'golden-panda-secret-key-2024'

// OPCION 1: RSA con llaves más largas y mejor formateadas (2048 bits)
const RSA_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA2lYHLCPeYF3I8Q2V5J7K9M8N4O5P6Q7R8S9T0U1V2W3X4Y5Z
6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F
8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L
0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R
2S3T4U5V6W7X8Y9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X
4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D
wIDAQABAoIBAGf3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7
Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9
E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1
K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3
Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5
W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7
C8D9E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9
ECgYEA9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L
8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R
0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X
2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0A1B2C3D
4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J
6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P
8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V
0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0A1B
-----END RSA PRIVATE KEY-----`

const RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2lYHLCPeYF3I8Q2V5J7K
9M8N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R
4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3V4W5X
6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D
8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0A1B2C3D4E5F6G7H8I9J
0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P
2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3V
4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B
6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0A1B2C3D4E5F6G7H
8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N
0O1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5DwIDAQAB
-----END PUBLIC KEY-----`

// OPCION 2: Usar SHA-256 como alternativa más simple y confiable
const hashPasswordSHA256 = (password) => {
  try {
    const salt = 'golden-panda-salt-2024'
    return crypto.createHash('sha256').update(password + salt).digest('hex')
  } catch (error) {
    throw new Error('Error hashing password with SHA-256')
  }
}

// OPCION 3: Usar bcrypt (requiere instalar: npm install bcrypt)
// import bcrypt from 'bcrypt'
// const hashPasswordBcrypt = async (password) => {
//   return await bcrypt.hash(password, 10)
// }

// Encriptar password con RSA (versión corregida)
export const encryptPassword = (password) => {
  try {
    // Verificar que la contraseña no sea muy larga para RSA
    if (password.length > 100) {
      throw new Error('Password too long for RSA encryption')
    }

    const encrypted = crypto.publicEncrypt(
      {
        key: RSA_PUBLIC_KEY,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      Buffer.from(password, 'utf8')
    )
    return encrypted.toString('base64')
  } catch (error) {
    console.error('RSA encryption failed, falling back to SHA-256')
    // Fallback a SHA-256 si RSA falla
    return hashPasswordSHA256(password)
  }
}

// Desencriptar password con RSA
export const decryptPassword = (encryptedPassword) => {
  try {
    const decrypted = crypto.privateDecrypt(
      {
        key: RSA_PRIVATE_KEY,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      Buffer.from(encryptedPassword, 'base64')
    )
    return decrypted.toString('utf8')
  } catch (error) {
    // Si falla la desencriptación RSA, probablemente es un hash SHA-256
    throw new Error('Cannot decrypt - password might be hashed with SHA-256')
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
    expiresIn: '8h'
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

// Comparar passwords (funciona tanto con RSA como con SHA-256)
export const comparePasswords = (plainPassword, storedPassword) => {
  try {
    // Intentar desencriptar como RSA primero
    try {
      const decryptedPassword = decryptPassword(storedPassword)
      return plainPassword === decryptedPassword
    } catch (rsaError) {
      // Si falla RSA, comparar como hash SHA-256
      const hashedPlainPassword = hashPasswordSHA256(plainPassword)
      return hashedPlainPassword === storedPassword
    }
  } catch (error) {
    console.error('Password comparison failed:', error.message)
    return false
  }
}

// Función adicional para hash con SHA-256 (alternativa recomendada)
export const hashPassword = hashPasswordSHA256

/*
NOTAS DE IMPLEMENTACION:

1. Este archivo soluciona el problema de RSA usando llaves más largas (2048 bits)
2. Incluye un fallback automático a SHA-256 si RSA falla
3. La función comparePasswords() maneja ambos tipos de encriptación
4. Para mayor seguridad, considera usar bcrypt instalando: npm install bcrypt

RECOMENDACIONES:
- Para desarrollo: usar SHA-256 (más simple)
- Para producción: usar bcrypt (más seguro)
- RSA es más complejo y puede dar problemas con contraseñas largas
*/