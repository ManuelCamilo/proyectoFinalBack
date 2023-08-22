import productModel from '../model/products.model.js'
import ProductRepository from '../services/productRepository.js';
import CustomError from '../services/errors/CustomError.js';
import EErros from '../services/errors/EErros.js';

export default class ProductManager extends ProductRepository {
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
            throw new CustomError.createError({
              name: "Error al obtener los productos",
              cause: error,
              message: "Se produjo un error al intentar obtener la lista de productos.",
              code: EErros.GET_PRODUCTS_ERROR,
            });
        }
    }

    async getProductsById(pid) {
        try{
            const foundProduct = await productModel.findById(pid);
            return foundProduct;
        } catch (error) {
            // console.error("Error al obtener el producto:", error);
            throw new CustomError.createError({
              name: "Producto no encontrado",
              cause: error,
              message: "El producto solicitado no fue encontrado en la base de datos.",
              code: EErros.PRODUCT_NOT_FOUND,
            });
        }
    }

    async addProduct(product, user) {
        try{
            if (!product.owner) {
                product.owner = 'admin'
            } else {
                product.owner = user.email;
            }
            const newProduct = await productModel.create(product);
            return newProduct;
        } catch (error) {
            console.error("Error creando el producto:", error);
            throw new CustomError.createError({
              name: "Error al crear el producto",
              cause: error,
              message: "Se produjo un error al intentar agregar el producto al catalogo.",
              code: EErros.ADD_PRODUCT_ERROR,
            });
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
            console.error("Error al actualizar el producto:", error);
            throw new CustomError.createError({
              name: "Error al actualizar el producto",
              cause: error,
              message: "Se produjo un error al intentar actualizar el producto.",
              code: EErros.UPDATE_PRODUCT_ERROR,
            });
          }
    }
    
    async deleteProduct(id) {
        try {
            const deletedproduct = await productModel.findByIdAndDelete(id);
            return !!deletedproduct
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw new CustomError.createError({
              name: "Error al eliminar el producto",
              cause: error,
              message: "Se produjo un error al intentar eliminar el producto.",
              code: EErros.DELETE_PRODUCT_ERROR,
            });
        }
    }
}
