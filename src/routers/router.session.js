import { Router } from "express";
import sessionController from "../controllers/sessionController.js";


const router = Router();

router.get('/register', sessionController.register);
router.post('/register', sessionController.postRegister);
router.get('/failureRegister', sessionController.failureRegister);
router.get('/login', sessionController.login);
router.post('/login', sessionController.postLogin);
router.get('/failLogin', sessionController.failLogin);
router.get('/logout', sessionController.logout);
router.get('/github', sessionController.github);
router.get('/githubcallback', sessionController.githubCallback);
router.get('/current', sessionController.current);

export default router;
