const jwt = require("jsonwebtoken");
const { handleError } = require("../helper/handleError");
const User = require("../models/userModel");
const util = require('util');
const moment = require('moment');
const asyncVerify = util.promisify(jwt.verify);
const {isRefreshTokenExist,removeRefreshToken,saveRefershToken,
  removeAllRefreshToken,issueToken}=require("../helper/user")
const authenticateJWT = async (req, res, next) => {
  const {access_token} = req.cookies;
  console.log('before all')
  try {
    // const token = authHeader?.split(" ")[1];
    console.log("check auth")
    if (!access_token||!refresh_token) {
      handleError("please login", 403);
    }
    const user = await asyncVerify(access_token, process.env.ACCESS_TOKEN_SECRET)
    if (user?.sub) {
      const check_user = await User.findByPk(user?.sub)
      if (!check_user?.isActive) {
        handleError("This account is inactive, please contact our customer service", 403);
      }

        if (req.method == "GET") {
          if(req.url==='/checkout')
            {
            return res.redirect(
                "/login?token_compromised_error=" + encodeURIComponent("No-Auth-Redirect/checkout")
              );
            }
          return res.redirect(
            "/login?token_compromised_error=" + encodeURIComponent("No-Auth-Redirect")
          );
        }
      req.user = user;
      next();
      return
    }
    handleError("please login", 403);

  } catch (error) {
    if (req.method == "GET") {
          if(req.url==='/checkout')
            {
            return res.redirect(
                "/login?token_compromised_error=" + encodeURIComponent("No-Auth-Redirect/checkout")
              );
            }
          return res.redirect(
            "/login?token_compromised_error=" + encodeURIComponent("No-Auth-Redirect")
          );
        }

    if (req.method == "GET") {
        if(req.url==='/checkout')
          {
            return res.redirect(
              "/login?error=" + encodeURIComponent("No-Auth-Redirect/checkout")
            );
          }
        return res.redirect(
          "/login?error=" + encodeURIComponent("No-Auth-Redirect")
        );
      }
      return
 }
};

module.exports = { authenticateJWT };



