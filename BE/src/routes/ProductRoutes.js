// src/routes/ProductRoutes.js
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/ProductServices.js'

import { verificarToken } from '../middleware/AuthMiddleware.js'

export default function (fastify) {
  // puedes aplicar el middleware solo a algunas rutas
  fastify.get('/products', { preHandler: verificarToken }, listProducts)
  fastify.get('/products/:id', { preHandler: verificarToken }, getProduct)

  // rutas sin middleware
  fastify.get('/productos', listProducts)
  fastify.get('/productos/:id', getProduct)
  fastify.post('/productos', createProduct)
  fastify.put('/productos/:id', updateProduct)
  fastify.delete('/productos/:id', deleteProduct)
}
