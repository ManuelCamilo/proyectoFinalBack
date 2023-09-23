import { Router } from "express";
import UsersController from "../controllers/usersController.js";
import { upload } from "../services/multerMiddleware.js";
import { authorizeAdmin } from "../services/authMiddleware.js"


const router = Router();

router.get('/premium/:uid', UsersController.formDocs);

router.post('/:uid/documents', upload.fields([{name:'profileImage'}, {name:'productImage'}, {name:'identificacion'}, {name:'domicilio'}, {name:'compruebaCuenta'}]), UsersController.envDocs);

router.put('/premium/:uid', UsersController.changeRole);

router.get('/', authorizeAdmin, UsersController.usersList );

router.delete('/', UsersController.deleteIna)

router.post('/manualChangeRole/:userId', authorizeAdmin, UsersController.manualChangeRole);

router.delete('/manualDeleteUser/:userId', authorizeAdmin, UsersController.manualDeleteUser)

export default router