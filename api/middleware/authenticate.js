const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
  const token = req.get('Authorization')
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => { // process.env.SECRET
      if (err) return res.status(422).json(err);
      req.decoded = decoded;
      next();
    })
  } else {
    res.status(403).json({ error: 'no token provided. must be set in Authorization header.' })
  }
}

module.exports = { authenticate }