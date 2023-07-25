const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, '[]')
        }
    }

    generateID = () => {
        const products = this.getProducts()
        if (products.length === 0) return 1
        return products[products.length - 1].id + 1
    }

    addProduct = (product) => {
        const products = this.getProducts()
        const id = this.generateID()
        const productoNuevo = { ...product, id }
        products.push(productoNuevo)
        fs.writeFileSync(this.path, JSON.stringify(products))
        return productoNuevo
    }

    getProducts = () => {
        const carrito = fs.readFileSync(this.path, 'utf-8')
        return JSON.parse(carrito)
    }

    getProductById = (id) => {
        const products = this.getProducts()
        const product = products.find((product) => product.id === id)
        return product
    }

    updateProduct = (id, updatedFields) => {
        const products = this.getProducts()
        const index = products.findIndex((product) => product.id === id)
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedFields }
            fs.writeFileSync(this.path, JSON.stringify(products))
            return products[index]
        }
        return null
    }

    deleteProduct = (id) => {
        const products = this.getProducts()
        const index = products.findIndex((product) => product.id === id)
        if (index !== -1) {
            const deletedProduct = products.splice(index, 1)
            fs.writeFileSync(this.path, JSON.stringify(products))
            return deletedProduct[0]
        }
        return null
    }
}

module.exports = ProductManager;