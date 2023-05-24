import express from "express";
import ProductManager from "../helpers/mongoDB/productManager.js";

const router = express.Router()
const productManager = new ProductManager()

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