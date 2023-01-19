const mongoose = require('mongoose')

let connection = mongoose.connect(`${process.env.mongoUrl}/test`)

module.exports = connection
