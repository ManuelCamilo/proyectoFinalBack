import fs from 'fs'

class CartManager {
    constructor(path) {
    this.path = path
    }

    getCarts() {
        const carts = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        return carts;
    }

    getCartById(id) {
        const carts = this.getCarts();
        const cart = carts.find ((cart) => cart.id == id);
        return cart
    }
    
    generateId(carts) {
        if (carts.length === 0) return 1;
        return carts[carts.length - 1].id + 1;
    }

    createCart() {
        const carts= this.getCarts();
        const newCart = { 
            id: this.generateId(carts),
            products: []
        };
        carts.push(newCart);
        fs.writeFileSync(this.path, JSON.stringify(carts));
        return newCart;
    }

    addProductToCart(cid, pid, quantity) {
        const carts = this.getCarts();
        const cartIndex = carts.findIndex((cart) => parseInt(cart.id) === parseInt(cid));
        if (cartIndex === -1) {
        return { error: true, message: 'El carrito no existe' };
        }

        const cart = carts [cartIndex];
        const productIndex = cart.products.findIndex((product) => parseInt(product.product) === parseInt(pid));
        if (productIndex === -1) {
            cart.products.push({ product: pid, quantity: 1});
        } else {
            cart.products[productIndex].quantity += 1;
        }
          
        fs.writeFileSync(this.path, JSON.stringify(carts));
        return cart;
    }
    
        

}

export default CartManager;