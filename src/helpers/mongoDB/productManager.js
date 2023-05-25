import productModel from "../../model/products.model.js";

class ProductManager {
    async getProducts() {
        try{
            const products = await productModel.find().lean().exec();
            return products;
        } catch (error) {
            console.error("Error al traer los productos");
            throw error
        }
    }
    async getProductsById(id) {
        try {
            const product = await productModel.findById(id);
            return product;
        } catch (error) {
            console.error("Error al traer el producto");
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

