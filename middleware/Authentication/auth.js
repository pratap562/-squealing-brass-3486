const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticate = (req, res, next) => {
    const token = req.cookies?.token
    console.log(token, token);
    if (token) {
        jwt.verify(token, process.env.SECRETKEY, function (err, decoded) {
            // while err
            if (err) {
                return res.status(401).json({ 'msg': 'plg login' })
            }
            // decoded
            req.role = decoded.role
            req.username = decoded.username
            next()
        })
    } else {
        res.status(401).json({ 'msg': 'plg login again' })
    }
}

module.exports = authenticate