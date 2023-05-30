import ProductManager from "../helpers/productManager.js";


const productManager = new ProductManager()

const ProductController = { 
    async pcGetAll(request, response) {
        try {
            const { limit = 10, page = 1, sort} = request.query;

            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: sort === "desc" ? -1 : 1,
                lean: true
            };

            const result = await productManager.getProducts(options);

            // prevLink: prevPage ? `/api/products?page=${prevPage}` : null
            // nextLink: nextPage ? `/api/products?page=${nextPage}` : null

            response.status(200).json(result)
            // response.render('index', { products });
        } catch (error) {
            response.status(500).json({ message: 'Error al obtener los productos' });
        }
    },

    async pcGetByID(request,response) {
        try{
            const { pid } = request.params;
            const product = await productManager.getProductsById(pid);
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
            if (deletedProduct) {
                response.status(200).json({ message: 'Producto eliminado del catálogo' });
            } else {
                response.status(404).json({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            return response.status(200).json ({message: 'Producto eliminado del catalogo'})
        }
    }
}


export default ProductController;