import { Router } from 'express';
import ProductController from '../controllers/productController.js';
import { authorizePremium, authorizeAdmin } from '../services/authMiddleware.js';
// import isAdmin from '../services/role.js';

const router = Router();


router.get('/', ProductController.pcGetAll);
router.get('/mockingproducts',authorizeAdmin, ProductController.pcMockProduct);
router.get('/:pid', ProductController.pcGetByID);
router.post('/', authorizePremium, ProductController.pcCreateProduct);
router.put('/:pid', authorizeAdmin, ProductController.pcUpdateProduct);
router.delete('/:pid',authorizePremium, ProductController.pcDeleteProduct);

export default router;