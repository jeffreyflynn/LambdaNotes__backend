const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GoogleTokenStrategy = require("passport-google-plus-token");
const { ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.schema');

// compares hashed passwords
const localStrategy = new LocalStrategy((username, password, done) => {
  User
    .findOne({ "username": username })
    .then(user => {
      user
        .validatePassword(password)
        .then(isValid => isValid ? done(null, user) : done(null, false))
        .catch(err => done(err, false))
    }).catch(err => done(err, false))
})

// extracts token --> decodes token --> finds user from payload data
const JWTstrategy = new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('Authorization'), 
  secretOrKey: "_UA&?dv*p+^k%t!kr@re9Pv@Lw?wfG*R4vS*jxC=M!nfcV+Y7*dA=Z!aR-7mSBQfAvNqSN$MA*Vc&JSmfk=jQ%kr7DZCqFsJA_zjdjRZ*k&29BhW*mC3*f_pW*8L+KGEzkpT?HJr6-vp+zUw56cG?kjr@PqsqHywKHfJsH-AfBSLf^qh9T6wsa6GfT$5QD+U4TW$+%j2-sEN+$^sqBTzB!8rUAt8xjUGR!u=RG$M4bcNzwC+6S5d@d?&wK%wVV%t" // process.env.SECRET
}, async (payload, done) => {
  User
    .findById(payload.id)
    .then(user => user ? done(null, user) : done(null, false))
    .catch(err => done(err, false)) 
})

// login with google
const GoogleStrategy = new GoogleTokenStrategy({
  clientID: "962293448005-vas5rftptuuqf6tcueb9ismhmojn32oq.apps.googleusercontent.com",
  clientSecret: "UoFUZ53KU_uSkOIi3wGRP16X"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ "google.id": profile.id })
    if (existingUser) done(null, existingUser)

    const userData = { method: 'google', google: { id: profile.id, email: profile.emails[0].value } }
    const newUser = await User.create(userData)
    done(null, newUser)

  } catch(error) {
    done(error, false, error.message)
  }
})

module.exports = {
  localStrategy,
  JWTstrategy,
  GoogleStrategy
}