import CartManager from "../helpers/cartManager.js";

const cartManager = new CartManager();

const cartController = {
    async createCart(request, response) {
      try {
        const newCart = await cartManager.createCart();
        response.status(201).json({ message: 'Carrito creado con éxito!' })
      } catch (error) {
        console.error("Error creating cart:", error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    },

    async getCart (request, response) {
        const {cid} = request.params;
        try{
          const cart = await cartManager.getCartById(cid);
          if (!cart) {
              return response.status(404).json({ message: `No se encuentra el carrito con el id ${cid}`})
          }
          response.status(200).json(cart);
        } catch(error) {
          console.error("Error.", error);
          response.status(500).json({ message:'error al obtener el carrito '})
        }

    },
    
    async addProductToCart(request, response) {
      const { cid, pid } = request.params;
    
      try {
        const cart = await cartManager.addProductToCart(cid, pid);
        if (cart.error) {
          response.status(404).json(cart);
        } else {
          response.status(201).json({ message: 'Producto agregado con éxito' });
        }
      } catch (error) {
        response.status(500).json({ error: true, message: 'Error al agregar producto al carrito' });
      }
    }
}

export default cartController; 






