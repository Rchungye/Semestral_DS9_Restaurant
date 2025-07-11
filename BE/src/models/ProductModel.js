// src/models/ProductModel.js
class Product {
  constructor(id, name, price, category) {
    this.id = id
    this.name = name
    this.price = price
    this.category = category
  }

  getPriceWithCurrency() {
    return `$${this.price.toFixed(2)}`
  }
}

export default Product
