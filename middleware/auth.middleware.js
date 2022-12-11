const jwt = require("jsonwebtoken");
const { handleError } = require("../helper/handleError");

const authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
      handleError("no token",403)
    }
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        handleError("invalid token",403)
      }
      req.user = user;
      next();
    });
  } catch(error) {
    next(error);
  }

};

module.exports = {authenticateJWT};


