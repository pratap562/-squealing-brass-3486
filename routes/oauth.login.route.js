const { passportForLogin } = require('../config/google-oauth2')
const oauthForLogin = require('express').Router()
const UserModel = require('../Models/User.Model')
require('dotenv').config()

const setIntent = (req, res, next) => {
    req.body.intent = 'login'
    console.log(req.body.intent, 'set');
    next()
}

oauthForLogin.get('/', setIntent, passportForLogin.authenticate('google', { scope: ['profile', 'email'], callbackURL: 'http://localhost:3200/auth/google/login/callback' }), (req, res, next) => { console.log(req.body, 'xxxxxxxxxxxxxxxxxxxx'); next(); })

oauthForLogin.get('/callback', setIntent, passportForLogin.authenticate('google', { failureRedirect: '/login', session: false, callbackURL: 'http://localhost:3200/auth/google/login/callback' }),
    async function (req, res) {
        //sucessfull authentication, redirect home.
        // let newuser = new UserModel(req.user)
        // await newuser.save()
        console.log('login')
        console.log(req.user, 'user', req.url)
        let body = { email, name, picture, password } = req.user

        let userExist = await UserModel.find({ email })
        console.log(userExist);
        if (userExist.length >= 1) {
            // res.cookie('isSignup', 1, { maxAge: 20000, httpOnly: true, secure: true });

            console.log('hello');

            let data = await fetch(`${process.env.OWN_URL}/user/login`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' }
            })
            data = await data.json()
            console.log(data);

            if (data.err) {
                // handel server issue
            }
            if (data.msg == 'signin sucessfull') {

                res.cookie('justLogdin', true, { maxAge: 1000 * 60 * 60 });
                res.cookie('token', data.token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: true });
                res.cookie('refresh_token', data.refresh_token, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true, secure: true });
                return res.redirect(`${process.env.NEXT_URL}`)
            }


        } else {
            console.log('oyeee');
            res.cookie('userExist', false, { maxAge: 200000000 })
            return res.redirect(`${process.env.NEXT_URL}/signinsignup`)
        }



        // res.cookie('isSignup', 1, { maxAge: 20000, httpOnly: true, secure: true });
        // res.redirect(`${process.env.NEXT_URL}/signinsignup`)
        // res.send({ "msg": "hello" })
    })



module.exports = oauthForLogin