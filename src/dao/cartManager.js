import cartModel from '../model/carts.model.js';
import ticketModel from '../model/ticket.model.js';
import CartRepository from '../services/cartRepository.js';

export default class CartManager extends CartRepository{
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
        return {message: 'El carrito no existe'};
      }
  
      // const productIndex = await cart.products.findIndex((item) => { return item.product && item.product.toString() === productId});
      const productIndex = cart.products.findIndex(item => {
        return item.product && item.product.equals(productId);
      })
      
      if (productIndex === -1) {
        cart.products.push({ product: productId, quantity: 1 });
      } else {
        cart.products[productIndex].quantity += 1;
      }
  
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error agregando el producto al carrito", error);
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
  async purchaseCart(cartId, purchaserEmail) {
    try {
      const cart = await cartModel.findById(cartId).populate('products.product');
      if (!cart) {
        return { error: true, message: 'El carrito no existe' };
      }

      const productsToRemove = [];
  
      for (const item of cart.products) {
        const product = item.product;
        const quantityInCart = item.quantity;
        if (product.stock >= quantityInCart) {
          product.stock -= quantityInCart;
          await product.save();
          productsToRemove.push(product._id);
        }
      }
      
      cart.products = cart.products.filter(item => !productsToRemove.includes(item.product._id));


      const ticket = await this.createTicket(cartId, purchaserEmail);

      await cart.save();

      return { ticket: ticket };
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      throw error;
    }
  }

  async createTicket(cartId, purchasertEmail) {
    try {
      const cart = await cartModel.findById(cartId).populate('products.product');
      if(!cart) {
        return { message: 'el carrito no existe.'}
      }

      let amount = 0;
      for (const item of cart.products) {
        amount += item.product.price * item.quantity;
      }

      const ticketCount = await ticketModel.countDocuments();

      const code = ticketCount + 1;

      const newTicket = new ticketModel({
        code: code,
        purchase_datetime: new Date(),
        amount: amount,
        purchaser: purchasertEmail,
      });

      await newTicket.save();

      return newTicket;
    } catch (error) {
      console.error('Error al crear el ticket: ', error);
      throw error;
    }
  }

}