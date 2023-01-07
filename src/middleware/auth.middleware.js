const jwt = require("jsonwebtoken");
const { handleError } = require("../helper/handleError");
const User = require("../models/userModel");
const util = require('util');
const asyncVerify = util.promisify(jwt.verify);

const authenticateJWT = async(req, res, next) => {
  try {
    const token = req.cookies.access_token;
    // const token = authHeader?.split(" ")[1];
    if (!token) {
      handleError("please login", 403);
    }
    const user=await asyncVerify(token, process.env.SECRET)
    if(user?.sub){
      const check_user=await User.findByPk(user?.sub)
      if(!check_user?.isActive){
        handleError("This account is inactive, please contact our customer service", 403);
      }
      req.user = user;
      next();
      return
    }
      handleError("please login", 403);
   
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
