const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { v4: uuid4 } = require('uuid')
require('dotenv').config()

// passport.serializeUser(function (user, done) {
//     done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//     done(null, user);
// });

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: 'http://localhost:3200/auth/google/callback'
},
    async function (accessToken, refreshToken, profile, cb) {
        /*
         use the profile info (mainly profile id) to check if the user is registerd in ur db
         If yes select the user and pass him to the done callback
         If not create the user and then select him and pass to callback
        */
        let data = {
            email: profile._json.email,
            name: profile._json.name,
            picture: profile._json.picture,
            password: uuid4()
        }

        console.log(data)
        return cb(null, data);
    }
));

module.exports = passport