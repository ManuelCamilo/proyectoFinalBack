import { Router } from 'express';
import ProductController from '../controllers/productController.js';
import isAdmin from '../services/role.js';

const router = Router();


router.get('/', ProductController.pcGetAll);
router.get('/mockingproducts', ProductController.pcMockProduct);
router.get('/:pid', ProductController.pcGetByID);
router.post('/', ProductController.pcCreateProduct);
router.put('/:pid', ProductController.pcUpdateProduct);
router.delete('/:pid', ProductController.pcDeleteProduct);

export default router;