import express from "express";
import ProductManager from "../helpers/mongoDB/productManager.js";
import productModel from "../model/products.model.js";

const router = express.Router()
const productManager = new ProductManager()

router.get("/", async (req, res) => {

  const products = await productModel.find().lean().exec()
  console.log(products)
  res.render('index', { products })
  });


router.get("/realtimeProducts", (req, res) => {
    res.render("realTimeProducts", {});
});

export default router