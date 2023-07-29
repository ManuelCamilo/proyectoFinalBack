import CartManager from "../dao/cartManager.js";

const cartManager = new CartManager();

class CartService {
    async createCart() {
        try {
          return await cartManager.createCart();
        } catch (error) {
          throw new Error("Error al crear el carrito" + error.message);
        }
    }

    async getCartById(id) {
        try {
          return await cartManager.getCartById(id);
        } catch (error) {
          throw new Error("Error al obtener el carrito" + error.message);
        }
    }

    async addProductToCart(cid, pid) {
        try {
          return await cartManager.addProductToCart(cid, pid);
        } catch (error) {
          throw new Error("Error al agregar el producto al carrito" + error.message);
        }
    }

    async deleteProductToCart(cid, pid) {
        try {
          return await cartManager.deleteProductToCart(cid, pid);
        } catch (error) {
          throw new Error("Error al eliminar el producto del carrito" + error.message);
        }
    }

    async updateCart(cid, products) {
        try {
          return await cartManager.updateCart(cid, products);
        } catch (error) {
          throw new Error("Error al actualizar el carrito" + error.message);
        }
    }

    async updateQuantity(cid, pid, quantity) {
        try {
          return await cartManager.updateQuantity(cid, pid, quantity);
        } catch (error) {
          throw new Error("Cantidad error" + error.message);
        }
    }

    async emptyCart(cid) {
        try {
          return await cartManager.emptyCart(cid);
        } catch (error) {
          throw new Error("Error al vaciar el carrito" + error.message);
        }
    }

    async purchaseCart(cid, purchaserEmail) {
        try {
          return await cartManager.purchaseCart(cid, purchaserEmail);
        } catch (error) {
          throw new Error("Error al realizar la compra" + error.message);
        }
    }

}


export default CartService;