// const { Socket } = require("engine.io");
const { findSession } = require('../../serverr/sessionStore')
console.log(findSession);


const auth = (Socket, next) => {
    // console.log('yessss');
    const sessionID = Socket.handshake.auth.sessionID
    if (sessionID) {
        // find existing session
        const session = sessionStore.findSession(sessionID)
        console.log('aagaye');
        if (session) {
            // console.log('yes');
            console.log(session, 'zadu')
            Socket.sessionID = sessionID
            Socket.username = session.username
            return next()
        }
    }


    // console.log('yes');
    const username = Socket.handshake.auth.username
    if (!username) {
        console.log('yes');
        return next(new Error('Invalid username'))
    }
    // create new session
    // console.log('j');
    Socket.sessionID = Math.random()
    // console.log('yyy');
    Socket.username = username
    // console.log('hiii');
    next()
}

module.exports = auth