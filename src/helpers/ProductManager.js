import productModel from "../model/products.model.js";

class ProductManager {
    async getProducts(options) {
        const { limit = 10, page = 1, sort} = options;
    
        const paginationOptions = {
          page: page,
          limit: limit,
          sort: sort ? { price: sort } : null,
          lean: true
        };
    
        // const filter = query ? { $text: { $search: query } } : {};
    
        try {
          const result = await productModel.paginate({}, paginationOptions);
          return result;
          
        } catch (error) {
          console.error("Error al obtener los productos:", error);
          throw error;
        }
    }

    async addProduct(product) {
        try{
            const newProduct = await productModel.create(product);
            return newProduct;
        } catch (error) {
            console.error("Error agregando el producto:");
            throw error
        }
    }
    
    async updateProduct(id, updatedFields) {
        try{
            const product = await productModel.findByIdAndUpdate(
                id,
                updatedFields,
                {new:true}
            );
            return product;
        } catch (error) {
            console.error("Error al actualizar el producto");
            throw error
        }
    }
    async deleteProduct(id) {
        try {
            const deletedproduct = await productModel.findByIdAndDelete(id);
            if (deletedproduct) {
                console.log('Producto eliminado', deletedproduct);
                return true;
            } else {
                return false
            }
        } catch(error) {
            console.error("Error intentando eliminar el producto");
            throw error;
        }
    }

}



export default ProductManager;

