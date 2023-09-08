import { Router } from "express";
import { uploader } from "../utils.js";
import UsersController from "../controllers/usersController.js";


const router = Router();

router.get('/premium/:uid', UsersController.formDocs);

router.post('/:uid/documents', uploader.array, UsersController.envDocs);

router.put('/premium/:uid', UsersController.changeRole);

export default router