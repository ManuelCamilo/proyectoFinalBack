import cartModel from "../../model/carts.model.js";


class CartManager {
    async getCarts() {
        try{
            const carts = await cartModel.find();
            return carts;
        } catch (error) {
            console.error("Error al traer el carrito")
            throw error;
        }
    }
    async getCartById(id) {
        try{
            const cart = await cartModel.find(id);
            return cart;
        } catch (error) {
            console.error("No se encontro carrito con el id indicado")
            throw error
        }
    }
    async createCart() {
        try{
            const newCart = await cartModel.create({ products: [] });
            return newCart;
        } catch (error) {
            console.error("No se pudo crear el carrito");
            throw error;
        }
    }


}