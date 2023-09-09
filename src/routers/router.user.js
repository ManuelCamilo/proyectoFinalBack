import { Router } from "express";
import UsersController from "../controllers/usersController.js";
import { upload } from "../services/multerMiddleware.js";


const router = Router();

router.get('/premium/:uid', UsersController.formDocs);

router.post('/:uid/documents', upload.fields([{name:'profileImage'}, {name:'productImage'}, {name:'identificacion'}, {name:'domicilio'}, {name:'compruebaCuenta'}]), UsersController.envDocs);

router.put('/premium/:uid', UsersController.changeRole);

export default router