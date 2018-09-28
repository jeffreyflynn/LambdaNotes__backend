const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/users.schema");
const { 
  localStrategy, 
  JWTstrategy, 
  GoogleStrategy
} = require("../middleware/passport.strategies");


passport.use("local", localStrategy);
passport.use("jwt", JWTstrategy);
passport.use("GoogleToken", GoogleStrategy);

const authenticate = passport.authenticate('local', { session: false });
const validateToken = passport.authenticate('jwt', { session: false });
const googleToken = passport.authenticate('GoogleToken', { session: false });

const signToken = user => {
  const payload = { id: user._id, iat: new Date().getTime() };
  const secret = process.env.SECRET;
  const options = { expiresIn: '2h' };
  return jwt.sign(payload, secret, options);
}

const newUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) res.status(500).json({ error: 'both username and password are required' })
  // const userData = { method: 'local', local: { username: username, password: password }, google: {} }
  const userData = { username: username, password: password }
  console.log("user data: ", userData);

  User.create(userData).then(user => {
    console.log("HERE", user);
    return user;
  }).then(user => {
    const token = signToken(user);
    console.log("TOKEN", token);
    return token;
  }).then(token => {
    console.log("FINAL TOKEN");
    res.status(201).json({ token })
  }).catch(err => {
    console.log("oh no, an error occured", err);
    res.status(500).json({messgae: "oh no, an error occured", error: err});
  })
  // console.log("new user", newUser);

  // const token = await signToken(newUser)
  // console.log("token", token);

  // res.status(201).json({ token })
}

const basicLogin = (req, res) => {
  const { username, password } = req.user;
  if (!username || !password) res.status(500).json({ error: 'both username and password are required' })
  const token = signToken(req.user)
  res.status(200).json({ token })
}

const googleLogin = async (req, res) => {
  const token = await signToken(req.user)
  res.status(200).json({ token })
}

router.route('/').post(authenticate, basicLogin)
router.route('/register').post(newUser)
router.route('/oauth/google').post(googleToken, googleLogin)

module.exports = router;