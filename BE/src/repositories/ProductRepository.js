// src/repositories/ProductRepository.js
import Product from '../models/ProductModel.js'

let products = [
    new Product(1, 'Teclado', 29.99, 'Electrónicos'),
    new Product(2, 'Ratón', 19.50, 'Electrónicos'),
    new Product(3, 'Taza de Café', 7.25, 'Cocina'),
    new Product(4, 'Auriculares', 49.99, 'Electrónicos'),
    new Product(5, 'Camiseta', 15.00, 'Ropa'),
    new Product(6, 'Zapatos Deportivos', 75.00, 'Calzado'),
    new Product(7, 'Lámpara de Mesa', 22.50, 'Hogar'),
    new Product(8, 'Mochila', 40.00, 'Accesorios'),
    new Product(9, 'Libro de Cocina', 12.99, 'Libros'),
    new Product(10, 'Reloj de Pulsera', 55.00, 'Accesorios'),
    new Product(11, 'Silla de Oficina', 120.00, 'Muebles'),
    new Product(12, 'Cámara Digital', 250.00, 'Electrónicos'),
    new Product(13, 'Bolígrafo', 2.50, 'Papelería'),
    new Product(14, 'Cuaderno', 5.00, 'Papelería'),
    new Product(15, 'Cafetera', 80.00, 'Electrodomésticos'),
    new Product(16, 'Smartphone', 399.99, 'Electrónicos'),
    new Product(17, 'Pantalones Jeans', 30.00, 'Ropa'),
    new Product(18, 'Gafas de Sol', 45.00, 'Accesorios'),
    new Product(19, 'Planta Decorativa', 18.00, 'Hogar'),
    new Product(20, 'Mesa de Centro', 150.00, 'Muebles')
]

export const getAllProducts = () => {
    return products
}

export const getProductById = (id) => {
    return products.find(p => p.id === id)
}

export const createProduct = ({ name, price, category }) => {
    const id = products.length ? products[products.length - 1].id + 1 : 1
    const newProduct = new Product(id, name, parseFloat(price), category)
    products.push(newProduct)
    return newProduct
}

export const updateProduct = (id, { name, price, category }) => {
    const product = products.find(p => p.id === id)
    if (!product) return null

    product.name = name ?? product.name
    product.price = price !== undefined ? parseFloat(price) : product.price
    product.category = category ?? product.category
    return product
}

export const deleteProduct = (id) => {
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return false
    products.splice(index, 1)
    return true
}
