import { Router, response } from "express";
import UserModel from "../model/user.model.js"
import passport from "passport";
import { createHash, isValidPassword } from "../utils.js";


const router = Router()

router.get('/register', (request, response) => response.render('sessions/register')) //muestra form

router.post('/register', 
    passport.authenticate('register', {failureRedirect: '/session/failureRegister'}),
    async (request, response) => {
        response.redirect('/session/login')          
})

router.get('/failureRegister', (request, response) => {
    response.send({ error: 'failed!'})
})

router.get('/login', (request, response) => response.render('sessions/login'));

router.post('/login',
    passport.authenticate('login', {failureRedirect: '/session/failLogin'}),
    async (request, response ) => {

    if (!request.user) {
        return response.status(400).send({ status: 'error', error: 'Invalid credentials'})
    }
    
    request.session.user ={
        first_name: request.user.first_name,
        last_name: request.user.last_name,
        email: request.user.email,
        age: request.user.age
    }

    response.redirect('/products')
});

router.get('/failLogin', (request, response) => {
    response.send({ error: 'Fail in login'})
})

router.get('/logout', (request, response) => {
    request.session.destroy(err => {
        if (err) {
            response.status(500).render('errors/base', {error: err})
        } else {
            response.redirect('/session/login')
        }
    })
})

router.get('/github', passport.authenticate('github', {scope: ['user: email']}), (request, response) => {})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect:'/session/login'}),
    async(request, response) => {
        request.session.user = request.user
        response.redirect('/products/')
    }
)

export default router