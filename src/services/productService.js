import ProductManager from "../dao/productManager.js";

const productManager = new ProductManager();

class ProductService {
  async getAllProducts(options) {
    try {
      return await productManager.getProducts(options);
    } catch (error) {
      throw new Error("Error al obtener los productos: " + error.message);
    }
  }

  async getProductById(pid) {
    try {
      return await productManager.getProductsById(pid);
    } catch (error) {
      throw new Error("Error al obtener el producto: " + error.message);
    }
  }

  async addProduct(product, user) {
    try {
      return await productManager.addProduct(product, user);
    } catch (error) {
      throw new Error("Error agregando el producto: " + error.message);
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      return await productManager.updateProduct(id, updatedFields);
    } catch (error) {
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  }

  async deleteProduct(id) {
    try {
      return await productManager.deleteProduct(id);
    } catch (error) {
      throw new Error("Error intentando eliminar el producto: " + error.message);
    }
  }
}

export default ProductService;