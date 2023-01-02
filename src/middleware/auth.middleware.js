const jwt = require("jsonwebtoken");
const { handleError } = require("../helper/handleError");
const User = require("../models/userModel");

const authenticateJWT = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    // const token = authHeader?.split(" ")[1];
    if (!token) {
      handleError("please login", 403);
    }
    jwt.verify(token, process.env.SECRET, async(err, user) => {
      if (err) {
        handleError("please login", 403);
      }
      req.user = user;
      const check_user=await User.findByPk(user.sub)
      if(!check_user?.isActive){
      handleError("This account is inactive, please contact our customer service", 403);
      }
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
