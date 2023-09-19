import passport from "passport";
import currentDTO from "../dto/sessionDTO.js";
import userModel from "../model/user.model.js";

const sessionController = {
  async register(request, response) {
    response.render('sessions/register');
  },

  async postRegister(request, response) {
    passport.authenticate('register', { failureRedirect: '/api/session/failureRegister' })(request, response, async () => {
      console.log('Registration successful. Redirecting to login...');
      response.redirect('/api/session/login');
    });
  },

  async failureRegister(request, response) {
    response.send({ error: 'failed!' });
  },

  async login(request, response) {
    response.render('sessions/login');
  },

  async postLogin(request, response) {
    passport.authenticate('login', { failureRedirect: '/api/session/failLogin' })(request, response, async () => {
      if (!request.user) {
        return response.status(400).send({ status: 'error', error: 'Invalid credentials' });
      }

      request.user.last_connection = new Date();
      await request.user.save();

      request.session.user = {
        _id: request.user._id,
        first_name: request.user.first_name,
        last_name: request.user.last_name,
        email: request.user.email,
        age: request.user.age,
        cart: request.user.cart,
        role: request.user.role
      }

      response.redirect('/products');
    });
  },

  async failLogin(request, response) {
    response.send({ error: 'Fail in login' });
  },

  async logout(request, response) {
    if (request.isAuthenticated()) {
      request.user.last_connection = new Date();
      await request.user.save();
    }

    request.session.destroy(err => {
      if (err) {
        response.status(500).render('errors/base', { error: err });
      } else {
        response.redirect('/api/session/login');
      }
    });
  },

  async github(request, response) {
    passport.authenticate('github', { scope: ['user:email'] })(request, response, () => {});
  },

  async githubCallback(request, response) {
    passport.authenticate('github', { failureRedirect: '/api/session/login' })(request, response, async () => {
      request.session.user = request.user;
      response.redirect('/products/');
    });
  },

  async current(request, response) {
    if (request.session.user) {
      const sessionDTO = new currentDTO(request.session.user);
      response.status(200).json({ currentSession: sessionDTO });
    } else {
      response.status(401).json({ error: 'Session not found' });
    }
  }
};

export default sessionController;