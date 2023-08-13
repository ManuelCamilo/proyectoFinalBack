import express from 'express';

const router = express.Router();

router.get('/',) // 1- mostrar el formulario - redireccionado desde Forgout your password?
router.post('/sendRecoveryEmail') // Enviar email de recuperación, al email indicado. Tambien corrobora correo existente.
router.get('/reset/:token') // mostrar formulario restablecer la contraseña,  Luego de clickear recuperar en el correo
router.post('/reset/:token') // ingresa su nueva contraseña y envía el formulario, esta ruta  actualiza la contraseña del usuario.
router.get('/success') // mostrar página - contraseña restablecida -
router.get('/error') // 