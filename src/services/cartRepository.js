export default class CartRepository {
    async getCartById(id) {}
    async createCart() {}
    async addProductToCart(cartId, productId) {}
    async deleteProductToCart(cartId, productId) {}
    async updateCart(cartId, updatedProducts) {}
    async updateQuantity(cartId, productId, quantity) {}
    async emptyCart(cartId) {}
    async purchaseCart(cartId, purchaserEmail) {}
    async createTicket(cartId, purchaserEmail) {}
  }