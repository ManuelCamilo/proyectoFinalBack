import { Router } from 'express';
import cartController from '../controllers/cartController.js';

const router = Router();


router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCart);
router.post('/:cid/products/:pid', cartController.addProductToCart);

router.delete('/:cid/products/:pid', cartController.pcDeleteProductToCart);
router.put('/:cid',)
router.put('/:cid/products/:pid') 
router.delete('/:cid')

export default router;