// src/controllers/ProductController.js
import * as productRepo from '../repositories/ProductRepository.js'

export const listProducts = async (request, reply) => {
    console.log('\nGET /productos called\n')
    const allProducts = productRepo.getAllProducts()
    return allProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.getPriceWithCurrency(),
        category: p.category
    }))
}

export const getProduct = async (request, reply) => {
    console.log(`\nGET /productos/${request.params.id} called\n`)
    const id = parseInt(request.params.id)
    const product = productRepo.getProductById(id)
    if (!product) {
        return reply.status(404).send({ error: 'Product not found' })
    }
    return {
        id: product.id,
        name: product.name,
        price: product.getPriceWithCurrency(),
        category: product.category
    }
}

export const createProduct = async (request, reply) => {
    console.log('\nPOST /productos called\n')
    const { name, price, category } = request.body
    if (!name || price === undefined || !category) {
        return reply.status(400).send({ error: 'Missing required fields' })
    }
    const newProduct = productRepo.createProduct({ name, price, category })
    return reply.status(201).send({
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.getPriceWithCurrency(),
        category: newProduct.category
    })
}

export const updateProduct = async (request, reply) => {
    console.log(`\nPUT /productos/${request.params.id} called\n`)
    const id = parseInt(request.params.id)
    const { name, price, category } = request.body
    const updatedProduct = productRepo.updateProduct(id, { name, price, category })

    if (!updatedProduct) {
        return reply.status(404).send({ error: 'Product not found' })
    }

    return {
        id: updatedProduct.id,
        name: updatedProduct.name,
        price: updatedProduct.getPriceWithCurrency(),
        category: updatedProduct.category
    }
}

export const deleteProduct = async (request, reply) => {
    console.log(`\nDELETE /productos/${request.params.id} called\n`)
    const id = parseInt(request.params.id)
    const deleted = productRepo.deleteProduct(id)

    if (!deleted) {
        return reply.status(404).send({ error: 'Product not found' })
    }
    return { message: 'Product deleted successfully' }
}