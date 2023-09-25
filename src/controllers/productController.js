import ProductService from "../services/productService.js";
import { generateProduct } from "../utils.js";
import logger from "../services/logger.js";
import dotenv from 'dotenv'
import emailConfig from "../config/emailConfig.js";
dotenv.config()


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
            logger.error('Error al obtener los productos', error)
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
            logger.error('Error al obtener el producto:', error)
            response.status(500).json({ message: 'Error al obtener el producto'});
        }
    },

    async pcCreateProduct(request,response) {
        try{
            const user = request.session.user;
            const productoNuevo = await productService.addProduct(request.body, user);
            response.status(201).json(productoNuevo);
        } catch (error) {
            logger.error('Error al crear el producto:', error);
            response.status(500).json({ message: 'Error al crear el producto' })
        }
    },

    async pcUpdateProduct(request,response) {
        try {
            const updatedProduct = await productService.updateProduct(request.params.pid,request.body)
        if (!updatedProduct) {
            logger.warning('Producto no encontrado')
            return response.status(404).json({ message: 'Producto no encontrado' });
        }
        response.status(200).json({ message: 'Producto actualizado con éxito'});
        } catch (error) {
            logger.error('Error al actualizar el Producto.', error);
            response.status(400).json({message: error.message});
        }
    },

    async pcDeleteProduct(request,response) {
        try{
            const productId = request.params.pid;
            const user = request.session.user;
            const existProduct = await productService.getProductById(productId)
            if(!existProduct) {
                return response.status(404).json({message:'Producto no encontrado'})
            }

            if (user.role === 'admin' || (user.role === 'premium' && existProduct.owner === user.email)) {
                const deleted = await productService.deleteProduct(productId, user);

                if (deleted && user.role === 'premium' && existProduct.owner === user.email) {
                    const mailOptions = {
                        from: process.env.GMAIL_USER,
                        to: user.email,
                        subject: 'Tu producto ha sido eliminado.',
                        html: `Tu producto se ha eliminado del catálogo, si tienes alguna duda no dudes en contactarte.`,
                    };
                    
                    await emailConfig.transporter.sendMail(mailOptions);
                    console.log("correo enviado")
                    
                } 
                response.status(200).json({ message: 'Producto eliminado con éxito'})
            } else {
                response.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
            }
        } catch (error) {
            logger.error('Error al eliminar el producto')
            console.log(error)
            return response.status(500).json ({message: 'Error al eliminar el producto'})
        }
    },

    async pcMockProduct (request, response) {
        try {
            const products = []
            for (let index = 0; index < 10; index++) {
                products.push(generateProduct())
            }
            response.send({ status: 'success', payload:products})
        } catch {
            response.status(400).json({message: 'error'});
        }
    }

    
}


export default ProductController;