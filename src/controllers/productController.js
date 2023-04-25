
import ProductManager from '../helpers/ProductManager.js';


const productManager = new ProductManager('./src/data/productos.json')

const productController = { 
    pcGetAll(request, response) {
        const products = productManager.getProducts();
        response.status(200).json(products);
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
        const updatedProduct = productManager.updateProduct(
            request.params.pid,
            request.body.title,
            request.body.description,
            request.body.code,
            request.body.price,
            request.body.status,
            request.body.stock,
            request.body.category,
            request.body.thumbnails,
        );   
        if (!updatedProduct) {
            return response.status(404).json({ message: 'Producto no encontrado'})
        }
        response.json(updatedProduct)
    },

    pcDeleteProduct(request,response) {
        const deletedProduct = productManager.deleteProduct(request.params.pid);
        if (!deletedProduct) {
            return response.status(404).json( { message: 'Producto no encontrado'} )
        }
        response.json(deletedProduct);
    }
    
}


export default productController;