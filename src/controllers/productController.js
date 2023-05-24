import ProductManager from "../helpers/mongoDB/productManager.js";


const productManager = new ProductManager()

const productController = { 
    async pcGetAll(request, response) {
        try {
            const products = await productManager.getProducts();
            response.render('index', { products });
        } catch (error) {
            response.status(500).json({ message: 'Error al obtener los productos' });
        }
    },

    async pcGetByID(request,response) {
        try{
            const pid = parseInt(request.params.pid);
            if (isNaN(pid)){
                response.status(400).json({ message: `El ID '${request.params.pid}' no es un número válido`});
                return
            }
            const product = await productManager.getProductById(pid);
            if (product) {
                response.status(200).json(product);
            } else {
                response.status(404).json({ message: `El producto con el id ${pid} no se encuentra`});
            }
        } catch (error) {
            response.status(500).json({ message: 'Error al obtener el producto'});
        }
    },

    async pcCreateProduct(request,response) {
        try{
            const productoNuevo = await productManager.addProduct(request.body);
            response.status(201).json({ message: 'Producto agregado con éxito' })
        } catch (error) {
            response.status(500).json({ message: 'Error al agregar el producto' })
        }
    },

    async pcUpdateProduct(request,response) {
        try {
            const updatedProduct = await productManager.updateProduct(request.params.pid,request.body)
        if (!updatedProduct) {
            return response.status(404).json({ message: 'Producto no encontrado' });
        }
        response.status(200).json({ message: 'Producto actualizado con éxito'});
        } catch (error) {
            response.status(400).json({message: error.message});
        }
    },

    async pcDeleteProduct(request,response) {
        try{
            const deletedProduct = await productManager.deleteProduct(request.params.pid);
            if (!deletedProduct) {
            return response.status(404).json ({ message: 'Producto no encontrado'})
            }
        } catch (error) {
            return response.status(200).json ({message: 'Producto eliminado del catalogo'})
        }
    }
}


export default productController;