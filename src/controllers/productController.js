import ProductService from "../services/productService.js";
import { generateProduct } from "../utils.js";

const productService = new ProductService();

const ProductController = { 
    async pcGetAll(request, response) {
        try {
          const { limit = 10, page = 1, sort, query, filter } = request.query;
    
          const options = {
            limit: limit,
            page: page,
            sort: sort,
            query: query,
            filter: filter,
          };
    
          const result = await productService.getAllProducts(options);
            response.status(200).json(result);
            // response.render('index', { products });
        } catch (error) {
            response.status(500).json({ message: 'Error al obtener los productos' });
        }
    },

    async pcGetByID(request,response) {
        try{
            const { pid } = request.params;
            const product = await productService.getProductById(pid);
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
            const productoNuevo = await productService.addProduct(request.body);
            response.status(201).json({ message: 'Producto agregado con éxito' })
        } catch (error) {
            response.status(500).json({ message: 'Error al agregar el producto' })
        }
    },

    async pcUpdateProduct(request,response) {
        try {
            const updatedProduct = await productService.updateProduct(request.params.pid,request.body)
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
            const deletedProduct = await productService.deleteProduct(request.params.pid);
            if (deletedProduct) {
                response.status(200).json({ message: 'Producto eliminado del catálogo' });
            } else {
                response.status(404).json({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            return response.status(200).json ({message: 'Producto eliminado del catalogo'})
        }
    },

    async pcMockProduct (request, response) {
        try {
            const products = []
            for (let index = 0; index < 100; index++) {
                products.push(generateProduct())
            }
            response.send({ status: 'success', payload:products})
        } catch {
            response.status(400).json({message: 'error'});
        }
    }

    
}


export default ProductController;