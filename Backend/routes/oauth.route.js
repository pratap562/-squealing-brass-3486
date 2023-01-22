const passport = require('../config/google-oauth')
const oauth = require('express').Router()
const UserModel = require('../Models/User.Model')

oauth.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }))

oauth.get('/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }),
    async function (req, res) {
        //sucessfull authentication, redirect home.
        // let newuser = new UserModel(req.user)
        // await newuser.save()
        // console.log(req.user, 'user')
        res.cookie('name', 'value', { maxAge: 900000, httpOnly: true, secure: true });
        res.redirect('http://localhost:3000/')
        // res.send({ "msg": "hello" })
    })


module.exports = oauth
