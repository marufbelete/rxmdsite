const jwt = require("jsonwebtoken");
const { handleError } = require("../helper/handleError");

const authenticateJWT = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    // const token = authHeader?.split(" ")[1];
    if (!token) {
      handleError("please login", 403);
    }
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        handleError("please login", 403);
      }
      req.user = user;
      next();
    });
  } catch (error) {
    if (req.method == "GET") {
      return res.redirect(
        "/login?error=" + encodeURIComponent("No-Auth-Redirect")
      );
    }
    next(error);
  }
};

module.exports = { authenticateJWT };
