import { Router } from 'express';
import ProductController from '../controllers/productController.js';
import isAdmin from '../services/role.js';

const router = Router();


router.get('/', ProductController.pcGetAll);
router.get('/:pid', ProductController.pcGetByID);
router.post('/', isAdmin, ProductController.pcCreateProduct);
router.put('/:pid', isAdmin, ProductController.pcUpdateProduct);
router.delete('/:pid', isAdmin, ProductController.pcDeleteProduct);


export default router;