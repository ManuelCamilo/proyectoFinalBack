import passport from "passport";
import local from 'passport-local'
import userModel from "../model/user.model.js";
import GitHubStrategy from 'passport-github2';
import { createHash, isValidPassword } from "../utils.js";
import config from "./config.js";
import cartModel from "../model/carts.model.js"

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(request, username, password, done) => {
        const { first_name, last_name, age, email } = request.body
        try {
            const user = await userModel.findOne({ email: username })
            if(user) {
                console.log('User already exists!')
                return done(null, false)
            }

            const cartForNewUser = await cartModel.create({})
            const newUser = {
                first_name, last_name, age, email,
                password: createHash(password),
                cart: cartForNewUser._id, 
                role
            }
            const result = await userModel.create(newUser)
            return done(null, result)
        } catch(err) {
            return done('Error en passport REGISTER ')
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if(!user) {
                console.log('User does not exists')
                return done( null, user)
            }

            if(!isValidPassword(user, password)) return done(null, false)

            return done(null, user)
        } catch (error) {
            done('error')
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: config.client_id,
        clientSecret: config.client_secret,
        callbackURL: config.callback_url,
    }, async(accessToken, refreshTokem, profile, done) => {
        console.log(profile)

        try{
            const user = await userModel.findOne({ email: profile._json.email})
            if (user) {
                return done (null, user)
            } 
            const cartForNewUser = await cartModel.create({})
            const newUser = await userModel.create({
                first_name: profile._json.name,
                last_name: profile._json.name,
                age: 0,
                email: profile._json.email,
                password: " ",
                cart: cartForNewUser._id,
                role: 'premium'
            })
            return done(null, newUser)
        } catch (err) {
            return done('Error to login with github')
        }
    }))

    passport.serializeUser((user, done) => {
        done( null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await userModel.findById(id)
        done (null, user)
    })

}

export default initializePassport