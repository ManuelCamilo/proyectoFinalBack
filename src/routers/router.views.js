import express from "express";
import ProductManager from "../helpers/ProductManager.js";

const router = express.Router()
const productManager = new ProductManager('./data/productos.json')

router.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.render ('realTimeProducts', {products})
})

export default router