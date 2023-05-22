import fs from 'fs'


class ProductManager{
    constructor(path) {
        this.path = path
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, '[]')
        }
    }
    
    addProduct = async (product) => {
          const products = await this.getProducts();
          const id = this.generateID();
          const productoNuevo = { ...product, id };
          products.push(productoNuevo);
          await fs.promises.writeFile(this.path, JSON.stringify(products));
          return productoNuevo;
    };

    generateID = () => {
        if (!fs.existsSync(this.path)) return 1;
        const products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
        let id = products[products.length - 1].id + 1;
        return id;
    };

    getProducts = async () => {
        if (!fs.existsSync (this.path)) {
            return [];
        } else {
          const data = await fs.promises.readFile(this.path, 'utf-8');
          if (data) {
            const products = JSON.parse(data);
            return await products;
        }
        }
    };

    getProductos = async () => {
        const products = await this.getProducts();
        return await products;
      };

    getProductById = (id) => {
        const products = this.getProducts()
        const product = products.find((product) => product.id === id)
        return product
    } 

    updateProduct = (id, updatedFields) => {
        const products = this.getProducts()
        const productIndex = products.findIndex((product) => product.id == id)

        if (productIndex === -1) {
            return null
        }
        const productoUp = products[productIndex];
        if ('id' in updatedFields && updatedFields.id !== productoUp.id) {
            throw new Error("No se puede actualizar el campo 'id'");
        }
        products[productIndex] = { ...products[productIndex], ...updatedFields };
        fs.writeFileSync(this.path, JSON.stringify(products));
        return products[productIndex];
    }   
    

    deleteProduct = async (id) => {
        try {
          const products = await this.getProducts();
          const index = products.findIndex((product) => product.id == id);
          if (index !== -1) {
            const deletedProduct = products.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return deletedProduct[0];
          }
          return false;
        } catch (error) {
          throw new Error('Error deleting product');
        }
    };
}

export default ProductManager;