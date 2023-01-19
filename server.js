const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')

const { httpserver, app } = require('./config/httpConnection')
const user = require('./routes/user.route')
const connection = require('./config/db')
const authenticate = require('./middleware/Authentication/auth')
const autharize = require('./middleware/Authorization/autharize')
// const chat = require('./routes/chat.route')

// const chat = require
// const auth = require('./middleware/auth2')
const port = 3000



// let users = { 0: [] }
app.use(cors({
    origin: 'https://elaborate-tiramisu-ba3b1a.netlify.app',
    credentials: true
}))
// httpserver.use(cors)
app.use(express.json())
app.use(cookieParser())


app.get('/', (req, res) => {
    res.send({ 'msg': 'welocme' })
})
app.use('/user', user)
// app.use('/chat',)

app.get('/reports', authenticate, (req, res) => {
    res.send({ 'data': 'reports' })
})


app.get('/alldata', authenticate, autharize(['admin']), (req, res) => {
    res.send({ 'data': 'all-data' })
})



httpserver.listen(port, async () => {
    try {
        await connection
        console.log(`your db is connected to port ${port}`);
        // runsocket()
    } catch (err) {
        console.log('err on connecting db:', err);
    }
})


