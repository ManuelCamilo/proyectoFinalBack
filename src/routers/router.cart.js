import { Router } from 'express';
import cartController from '../controllers/cartController.js';

const router = Router();


router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCart);
router.post('/:cid/products/:pid', cartController.addProductToCart);


export default router;