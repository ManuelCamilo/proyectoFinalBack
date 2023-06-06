import { Router } from "express";
import UserModel from "../model/user.model.js"


const router = Router()

router.get('/register', (request, response) => response.render('sessions/register')) //muestra form

router.post('/register', async (request, response) => {
    const userNew = request.body          // datos del form
    const user = new UserModel(userNew)   // crea objeto usuario
    await user.save()                     // guarda en bdd
    response.redirect('/session/login')          
})

router.get('/login', (request, response) => response.render('sessions/login'));

router.post('/login', async (request, response ) => {
    const { email, password } = request.body
    const user = await UserModel.findOne({ email }).lean().exec()
    if (!user) {
        return response.status(401).render('errors/base', {
            error: 'Error en email o contraseña'
        })
    }

    const passwordCorrect = (password === user.password);

    if (!passwordCorrect) {
        return response.status(401).render('errors/base', {
        error: 'Error en email y/o contraseña'
        });
    }
  
    request.session.user = user;

    if (user.email === 'adminCoder@coder.com') {
        request.session.role = 'admin';
        response.redirect('/products');
      } else {
        request.session.role = 'usuario';
        response.redirect('/products');
      }
});




router.get('/logout', (request, response) => {
    request.session.destroy(err => {
        if (err) {
            response.status(500).render('errors/base', {error: err})
        } else {
            response.redirect('/session/login')
        }
    })
})

export default router