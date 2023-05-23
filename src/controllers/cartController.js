import CartManager from "../helpers/mongoDB/cartManager.js";


const cartManager = new CartManager();

const cartController = {
    createCart (request, response) {
        const newCart = cartManager.createCart();
        response.status(200).json(newCart);
    },

    getCart (request, response) {
        const {cid} = request.params;
        const cart = cartManager.getCartById(cid);
        if (!cart) {
            return response.status(404).json({ message: `No se encuentra el carrito con el id ${cid}`})
        }

        response.status(200).json(cart);
    },
    
    addProductToCart (request, response) {
        const { cid, pid } = request.params;
        const { quantity } = request.body;
      
        try {
          const cart =  cartManager.addProductToCart(cid, pid, quantity);
          if (cart.error) {
            response.status(404).json(cart);
          } else {
            response.status(201).json(cart);
          }
        } catch (error) {
          console.error(error);
          response.status(500).json({ error: true, message: 'Error al agregar producto al carrito' });
        }
    }
}

export default cartController; 






