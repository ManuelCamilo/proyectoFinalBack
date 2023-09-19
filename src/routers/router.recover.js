import express from 'express';
import recoveryController from '../controllers/recoveryController.js';

const router = express.Router();

router.get('/',recoveryController.showRecoveryForm) 
router.post('/sendRecoveryEmail', recoveryController.sendRecoveryEmail)
router.get('/reset/:token', recoveryController.showResetForm) 
router.post('/reset/:token', recoveryController.resetPassword)
export default router