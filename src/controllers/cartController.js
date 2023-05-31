import CartManager from "../helpers/cartManager.js";

const cartManager = new CartManager();

const cartController = {
    async pcCreateCart(request, response) {
      try {
        const newCart = await cartManager.createCart();
        response.status(201).json({ message: 'Carrito creado con éxito!', cart: newCart })
      } catch (error) {
        console.error("Error creating cart:", error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    },

    async pcGetCart (request, response) {
        const cid = request.params.cid;
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
    
    async pcAddProductToCart(request, response) {
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
    },

    async pcDeleteProductToCart(request, response) {
      const { cid, pid } = request.params;
      try {
        const cart = await cartManager.deleteProductToCart(cid, pid);
        if (cart.error) {
          response.status(404).json(cart);
        } else {
          response.status(201).json({ message: 'El producto se elimino con éxito del carrito ', cart})
        }
      } catch (error) {
        response.status(500)
      }
    },

    async pcUpdateCart(request, response) {
      try {
        const cid  = request.params.cid;
        const products = request.body.products;
  
        const result = await cartManager.updateCart(cid, products);
  
        if (result.error) {
          return response.status(404).json({ error: true, message: result.message });
        }
  
        return response.status(200).json(result);
      } catch (error) {
        console.error('Error updating cart:', error);
        return response.status(500).json({ error: true, message: 'Error al actualizar el carrito' });
      }
    },

    async pcUpdateQuantity(request, response) {
      try {
        const { cid, pid } = request.params;
        const quantity = request.body.quantity;
  
        const result = await cartManager.updateQuantity(cid, pid, quantity);
  
        if (result.error) {
          return response.status(404).json({ error: true, message: result.message });
        }
  
        return response.status(200).json(result);
      } catch (error) {
        console.error('Error updating cart item quantity:', error);
        return response.status(500).json({ error: true, message: 'Error al actualizar la cantidad del producto en el carrito' });
      }

    },

    async pcEmptyCart(request, response) {
      try {
        const cid = request.params.cid;

        const emptyCart = await cartManager.emptyCart(cid);
        
        if (emptyCart.error) {
          return response.status(404).json({message:"El carrito con el ID indicado no existe."})
        } 

        return response.status(200).json(emptyCart);
      } catch (error) {
        console.error('Error al intentar vaciar el carrito', error);
        return response.status(500).json({ error:true, message:"Error al vaciar el carrito"})
      }
    }

    

  };


export default cartController; 






