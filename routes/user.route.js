const express = require('express')
const bcrypt = require('bcrypt')
const dotevn = require('dotenv')
const jwt = require('jsonwebtoken')
const generateotp = require('../middleware/Authentication/generateotp')


const user = express.Router()
const UserModel = require('../Models/User.Model')
const redisConnection = require('../config/redis')
const redis = redisConnection()
dotevn.config()

user.post('/signup', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password || typeof (email) != 'string' || typeof (password) != 'string') {
        return res.status(400).json({ err: 'bad request' })
    }
    console.log('pass test');
    console.log(UserModel, 'usw');
    let userExist

    try {
        userExist = await UserModel.find({ email })
    } catch (err) {
        console.log('err', err);
    }
    console.log(userExist);
    if (userExist.length >= 1) {
        return res.status(403).json({ err: 'user allready exist' })
    }

    // password hashing
    const username = email.split('@')[0] + Math.floor(Math.random() * 90000) + 1000;
    bcrypt.hash(password, 2, async function (err, hash) {
        if (err) {
            return res.status(500).json({ 'err': 'something went wrong try after some time' });
        }
        // otp sending
        let uniqueId
        try {
            uniqueId = await generateotp(email, hash, username)
            console.log(uniqueId, 'unique id')
        } catch (err) {
            console.log('err while generating otp', err)
        }

        res.send({ 'msg': "sended the otp to email check", uniqueId })
        console.log('again', uniqueId)
        console.log('bahut pass hai');
        // res.cookie('uniqueId', uniqueId, { maxAge: 599990 * 1000, domain: 'elaborate-tiramisu-ba3b1a.netlify.app', secure: true, sameSite: 'None' })
        // res.cookie('uniqueId', uniqueId, { expire: new Date() + 12000 },)
    });



})

user.post('/verify', async (req, res) => {
    const { email, uniqueId } = req.body
    const userOtp = req.headers.otp

    const key = `${email}:${uniqueId}`;


    // createnewuser after otp varification
    const createNewUser = async ([username, hash, email]) => {
        let newUser = new UserModel({ email, username, password: hash, role: 'user' })
        console.log('pass to aa gaye', username, hash, email)
        await newUser.save((err) => {
            if (err) {
                console.log('err is comming', err);
                return res.status(500).json({ 'err': "something went wrong" })
            } else {
                console.log('document save sucessfull');
            }
        })
        console.log('pass pass hai');
        return res.status(201).json({ 'msg': 'user create sucessfull' })
    }



    // getint otp from redis to verify
    await redis.lrange(key, 0, -1, (err, allDetails) => {
        if (err) {
            console.log('err in geting the otp from redis while verifying otp', err);
        } else {
            console.log(allDetails, 'this is otp');
            console.log(allDetails[3])
            let validOtp = allDetails[3]
            if (validOtp == userOtp) {
                // user varified
                console.log('user varified');
                createNewUser(allDetails)
                console.log(allDetails);
            } else {
                console.log(validOtp, userOtp)
                return res.status(401).json({ 'err': 'otp varification fail' })
            }
        }
    })
})


user.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password || typeof (email) != 'string' || typeof (password) != 'string') {
        return res.status(400).json({ err: 'bad request' })
    }
    // console.log('done')
    let userExist = await UserModel.find({ email })
    if (userExist.length == 0) {
        return res.status(404).json({ 'err': "user don't exist" })
    }
    console.log(userExist[0]);

    bcrypt.compare(password, userExist[0].password, function (err, result) {
        // result == false
        if (err) {
            return res.status(401).json({ 'err': 'bad credentials' })
        }
        // result == true
        let token = jwt.sign({ email, username: userExist.username, role: 'user' }, process.env.SECRETKEY, { expiresIn: 60 })
        let refresh_token = jwt.sign({ email, username: userExist.username }, process.env.REFRESHKEY, { expiresIn: 180 * 180 })
        res.cookie('token', token, { httpOnly: true })
        res.cookie('refresh_token', refresh_token, { httpOnly: true })
        return res.send({ 'msg': 'signin sucessfull' })
    });
})

module.exports = user