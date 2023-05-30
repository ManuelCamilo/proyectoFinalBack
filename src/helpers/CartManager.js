
import cartModel from "../model/carts.model.js";


class CartManager {
    async getCartById(id) {
      try {
        const cart = await cartModel.findById(id).populate('products.product');
        return cart;
      } catch (error) {
        console.error("Error getting cart by ID:", error);
        throw error;
      }
    }
  
    async createCart() {
      try {
        const newCart = await cartModel.create({ products: [] });
        return newCart;
      } catch (error) {
        console.error("Error creating cart:", error);
        throw error;
      }
    }
  
    async addProductToCart(cartId, productId) {
      try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
          return { error: true, message: 'El carrito no existe' };
        }
    
        const productIndex = await cart.products.findIndex((item) => { return item.product && item.product.toString() === productId});
        if (productIndex === -1) {
          cart.products.push({ product: productId, quantity: 1 });
        } else {
          cart.products[productIndex].quantity += 1;
        }
    
        await cart.save();
        return cart;
      } catch (error) {
        console.error("Error adding product to cart:", error);
        throw error;
      }
    } 

    
  }
  
  export default CartManager;