import productModel from '../model/products.model.js'

class ProductManager {
    async getProducts(options) {
    const { limit = 10, page = 1, sort, query, filter } = options;
    
    let sortValue = 0;
    if (sort === "desc") {
        sortValue = -1;
        } else if (sort === "asc") {
        sortValue = 1;
        }

    const queryFilter = {};
    if (query === "title") {
        queryFilter.title = filter;
        } else if (query === "category") {
        queryFilter.category = filter;
        }

    const paginationOptions = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sortValue !== 0 ? { price: sortValue } : undefined,
    };

  try {
    const result = await productModel.paginate(queryFilter, paginationOptions)
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
      prevLink: hasPrevPage ? `/api/products?page=${prevPage}&limit=${limit}&sort=${sort}` : null,
      nextLink: hasNextPage ? `/api/products?page=${nextPage}&limit=${limit}&sort=${sort}` : null,
    };

    return response;
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

