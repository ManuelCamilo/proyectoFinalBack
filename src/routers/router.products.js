import { Router } from 'express';
import ProductController from '../controllers/productController.js';
import { authorizePremiumAdmin, authorizeAdmin } from '../services/authMiddleware.js';
// import isAdmin from '../services/role.js';

const router = Router();


router.get('/', ProductController.pcGetAll);
router.get('/mockingproducts', ProductController.pcMockProduct);
router.get('/:pid', ProductController.pcGetByID);
router.post('/', authorizePremiumAdmin, ProductController.pcCreateProduct);
router.put('/:pid', authorizeAdmin, ProductController.pcUpdateProduct);
router.delete('/:pid',authorizePremiumAdmin, ProductController.pcDeleteProduct);

export default router;