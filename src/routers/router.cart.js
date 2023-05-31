import { Router } from 'express';
import cartController from '../controllers/cartController.js';

const router = Router();


router.post('/', cartController.pcCreateCart);
router.get('/:cid', cartController.pcGetCart);
router.post('/:cid/products/:pid', cartController.pcAddProductToCart);
router.delete('/:cid/products/:pid', cartController.pcDeleteProductToCart);
router.put('/:cid',cartController.pcUpdateCart);
router.put('/:cid/products/:pid',cartController.pcUpdateQuantity) 
router.delete('/:cid',cartController.pcEmptyCart)

export default router;