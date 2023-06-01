
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
  
  async deleteProductToCart(cartId, productId) {
    try{
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return {error: true, message: 'El carrito no existe' };
      }

      const productIndex = cart.products.findIndex(item => {
        return item.product && item.product.equals(productId);
      });
  
      if (productIndex === -1) {
        return { error: true, message: 'El producto no está en el carrito' };
      }
      
      cart.products.splice(productIndex, 1);

      await cart.save();
      return { success: true, message: 'Producto eliminado del carrito'};
    } catch (error) {
      console.error('Error eliminando el producto del carrito', error);
      throw error;
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return { message: 'El carrito no existe' };
      }
      cart.products = updatedProducts;

      await cart.save();
      return { message: "Carrito actualizado", cart };
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }

  async updateQuantity(cid, pid, quantity) {
    try{
      const cart = await cartModel.findById(cid);
      if (!cart) {
        return {message:"El carrito indicado no existe."}
      } 

      const product = cart.products.find(item => item.product && item.product.toString() === pid)
      if (!product) {
        return {message:"El producto no existe en el carrito."}
      }

      product.quantity = quantity;

      await cart.save();
      return {success: true, message:"cantidad actualizada"};
    } catch (error) {
      console.error ('Error actualziando la cantidad', error);
      throw WebGLVertexArrayObject;
    }
  }

  async emptyCart(cid) {
    try {
      const cart = await cartModel.findById(cid);
      if (!cart) {
        return {message:"El carrito indicado no existe"};
      }

      cart.products= [];

      await cart.save();
      return {success: true, message: "Carrito Vacio"};
    } catch (error) {
      console.error ('Error al vaciar el carrito:', error);
      throw error;
    }
  }


}
  
  export default CartManager;