
import ProductManager from '../helpers/ProductManager.js';


const productManager = new ProductManager('./data/productos.json')

const productController = { 
    pcGetAll(request, response) {
        const products = productManager.getProducts();
        // response.status(200).json(products);
        response.render('index', { products });
    },

    pcGetByID(request,response) {
        const pid = parseInt(request.params.pid);
        if (isNaN(pid)){
            response.status(400).json({ message: `El ID '${request.params.pid}' no es un número válido`});
            return
        }

        const product = productManager.getProductById(pid);
        if (product) {
            response.status(200).json(product);
        } else {
            response.status(404).json({ message: `El producto con el id ${pid} no se encuentra`})
        }
    },

    pcCreateProduct(request,response) {
        const productoNuevo = productManager.addProduct(request.body);

        response.status(201).json({ message: 'Producto agregado con éxito' })
    },

    pcUpdateProduct(request,response) {
        try {
            const updatedProduct = productManager.updateProduct(request.params.pid,request.body)

        if (!updatedProduct) {
            return response.status(404).json({ message: 'Producto no encontrado' });
        }
        response.status(200).json({ message: 'Producto actualizado con éxito'})
        } catch (error) {
            response.status(400).json({message: error.message})
        }
    },

    pcDeleteProduct(request,response) {
        const deletedProduct = productManager.deleteProduct(request.params.pid);
        if (!deletedProduct) {
            return response.status(404).json ({ message: 'Producto no encontrado'})
        }
        return response.status(200).json ({message: 'Producto eliminado del catalogo'})
    }
    
}


export default productController;