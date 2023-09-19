import express from "express";
import viewsController from "../controllers/viewsController.js";

const router = express.Router();

router.get("/", viewsController.renderIndex);
router.get("/realtimeProducts", viewsController.renderRealTimeProducts);
router.get("/products", viewsController.renderProductList);
router.get("/carts/:cid", viewsController.renderCart);

export default router;
