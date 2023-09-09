import { Router } from "express";
import UsersController from "../controllers/usersController.js";
import { uploadFiles } from "../services/multerMiddleware.js";


const router = Router();

router.get('/premium/:uid', UsersController.formDocs);

router.post('/:uid/documents',
uploadFiles('profileImage'),
uploadFiles('productImage'),
uploadFiles('identificacion'),
uploadFiles('domicilio'),
uploadFiles('compruebaCuenta'),
UsersController.envDocs);

router.put('/premium/:uid', UsersController.changeRole);

export default router