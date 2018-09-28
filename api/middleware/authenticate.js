const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
  const token = req.get('Authorization')
  if (token) {
    jwt.verify(token, "_UA&?dv*p+^k%t!kr@re9Pv@Lw?wfG*R4vS*jxC=M!nfcV+Y7*dA=Z!aR-7mSBQfAvNqSN$MA*Vc&JSmfk=jQ%kr7DZCqFsJA_zjdjRZ*k&29BhW*mC3*f_pW*8L+KGEzkpT?HJr6-vp+zUw56cG?kjr@PqsqHywKHfJsH-AfBSLf^qh9T6wsa6GfT$5QD+U4TW$+%j2-sEN+$^sqBTzB!8rUAt8xjUGR!u=RG$M4bcNzwC+6S5d@d?&wK%wVV%t", (err, decoded) => { // process.env.SECRET
      if (err) return res.status(422).json(err);
      req.decoded = decoded;
      next();
    })
  } else {
    res.status(403).json({ error: 'no token provided. must be set in Authorization header.' })
  }
}

module.exports = { authenticate }