import { Router } from 'express';
import productController from '../controllers/productController.js';

const router = Router();


router.get('/', productController.pcGetAll);
router.get('/:pid', productController.pcGetByID);
router.post('/', productController.pcCreateProduct)
router.put('/:pid', productController.pcUpdateProduct)
router.delete('/:pid', productController.pcDeleteProduct)


export default router;