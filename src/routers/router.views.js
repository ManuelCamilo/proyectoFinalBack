import express from "express";
import ProductManager from "../helpers/ProductManager.js";

const router = express.Router()
const productManager = new ProductManager('./data/productos.json')

router.get("/", (req, res) => {
  productManager.getProducts().then((products) => {
    if (products) {
      res.render("index", { products });
    }
  });
});

router.get("/realtimeProducts", (req, res) => {
    res.render("realTimeProducts", {});
});

export default router