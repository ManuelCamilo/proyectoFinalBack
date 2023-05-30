import productModel from "../model/products.model.js";

class ProductManager {
    async getProducts(options) {
        const { limit = 10, page = 1, sort} = options;
    
        const paginationOptions = {
          page: page,
          limit: limit,
          sort: sort ? { price: sort } : {},
        };

    
        try {
          const result = await productModel.paginate({}, paginationOptions);

        const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = result;

        
        const response = {
            status: "success",
            payload: docs,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevPage ? `/api/products?page=${prevPage}` : null,
            nextLink: nextPage ? `/api/products?page=${nextPage}` : null
          };
          
          return response
        } catch (error) {
          console.error("Error al obtener los productos:", error);
          throw error;
        }
    }

    async getProductsById(pid) {
        try{
            const foundProduct = await productModel.findById(pid);
            return foundProduct;
        } catch (error) {
            console.error("Error al obtener el producto: ", error);
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
                { $set: updatedFields },
                { new:true }
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

