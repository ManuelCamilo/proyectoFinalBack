import { Router } from "express";
import userModel from "../model/user.model.js";
import passport from "passport";
import currentDTO from "../dto/sessionDTO.js"; 

const router = Router()

router.get('/register', (request, response) => response.render('sessions/register')) //muestra form

router.post('/register', 
    passport.authenticate('register', {failureRedirect: '/api/session/failureRegister'}),
    async (request, response) => {
        console.log('Registration successful. Redirecting to login...')
        response.redirect('/api/session/login')          
})

router.get('/failureRegister', (request, response) => {
    response.send({ error: 'failed!'})
})

router.get('/login', (request, response) => response.render('sessions/login'));

router.post('/login',
    passport.authenticate('login', {failureRedirect: '/api/session/failLogin'}),
    async (request, response ) => {

    if (!request.user) {
        return response.status(400).send({ status: 'error', error: 'Invalid credentials'})
    }

    request.user.last_connection = new Date();
    await request.user.save();

    request.session.user ={
        _id: request.user._id,
        first_name: request.user.first_name,
        last_name: request.user.last_name,
        email: request.user.email,
        age: request.user.age,
        cart: request.user.cart,
        role: request.user.role
    }

    response.redirect('/products')
});

router.get('/failLogin', (request, response) => {
    response.send({ error: 'Fail in login'})
})

router.get('/logout', async (request, response) => {
    if (request.isAuthenticated()) {
        request.user.last_connection = new Date();

        await request.user.save();
    }
    request.session.destroy(err => {
        if (err) {
            response.status(500).render('errors/base', {error: err})
        } else {
            response.redirect('/api/session/login')
        }
    })
})

router.get('/github', passport.authenticate('github', {scope: ['user: email']}), (request, response) => {})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect:'/api/session/login'}),
    async(request, response) => {
        request.session.user = request.user
        response.redirect('/products/')
    }
)

router.get('/current', (request, response) => {
    if (request.session.user) {
        const sessionDTO = new currentDTO(request.session.user)
        response.status(200).json({ currentSession: sessionDTO});
    } else {
    response.status(401).json({ error: 'Session not found' });
    }
});

export default router