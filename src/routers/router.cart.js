import { Router } from 'express';
import cartController from '../controllers/cartController.js';
import { authorizeUser } from '../services/authMiddleware.js';


const router = Router();


router.post('/', cartController.pcCreateCart);
router.get('/:cid', cartController.pcGetCart);
router.post('/:cid/products/:pid', authorizeUser, cartController.pcAddProductToCart);
router.delete('/:cid/products/:pid', cartController.pcDeleteProductToCart);
router.put('/:cid', cartController.pcUpdateCart);
router.put('/:cid/products/:pid', cartController.pcUpdateQuantity) 
router.delete('/:cid', cartController.pcEmptyCart)
router.post('/:cid/purchase', cartController.pcPurchaseCart);

export default router;