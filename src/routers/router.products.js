import { Router } from 'express';
import ProductController from '../controllers/productController.js';

const router = Router();


router.get('/', ProductController.pcGetAll);
router.get('/:pid', ProductController.pcGetByID);
router.post('/', ProductController.pcCreateProduct)
router.put('/:pid', ProductController.pcUpdateProduct)
router.delete('/:pid', ProductController.pcDeleteProduct)


export default router;