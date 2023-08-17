import express from 'express';
import recoveryController from '../controllers/recoveryController.js';

const router = express.Router();

router.get('/',recoveryController.showRecoveryForm) // 1- mostrar el formulario - redireccionado desde Forgout your password?
router.post('/sendRecoveryEmail', recoveryController.sendRecoveryEmail) // Enviar email de recuperación, al email indicado. Tambien corrobora correo existente.
router.get('/reset/:token', recoveryController.showResetForm) // mostrar formulario restablecer la contraseña,  Luego de clickear recuperar en el correo
router.post('/reset/:token', recoveryController.resetPassword) // ingresa su nueva contraseña y envía el formulario, esta ruta  actualiza la contraseña del usuario.
router.get('/success', recoveryController.resetSuccess) // mostrar página - contraseña restablecida -
router.get('/error') // Token vencido, esta ruta redireccionara a la ruta para que el usuario pueda generar un nuevo token.

export default router