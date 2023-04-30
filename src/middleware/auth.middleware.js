const jwt = require("jsonwebtoken");
const { handleError } = require("../helper/handleError");
const User = require("../models/userModel");
const util = require('util');
const moment = require('moment');
const asyncVerify = util.promisify(jwt.verify);
const {isRefreshTokenExist,removeRefreshToken,saveRefershToken,
  removeAllRefreshToken,issueToken}=require("../helper/user")
const authenticateJWT = async (req, res, next) => {
  const {access_token,refresh_token} = req.cookies;
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
      //comporomised
      const is_token_exist=await isRefreshTokenExist(refresh_token,user?.sub)
      if(!is_token_exist)
      {
        res.clearCookie('access_token')
        res.clearCookie('refresh_token')
        await removeAllRefreshToken(user?.sub)
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
        return
      }
      req.user = user;
      next();
      return
    }
    handleError("please login", 403);

  } catch (error) {
    
    if (error instanceof jwt.TokenExpiredError) {
      try{
          const {sub,email,role,rememberme}=await asyncVerify(refresh_token,process.env.REFRESH_TOKEN_SECRET)
          const is_token_exist=await isRefreshTokenExist(refresh_token,sub)
          if(!is_token_exist)
          {
             //compromised
            console.log('compromised')
            res.clearCookie('access_token')
            res.clearCookie('refresh_token')
            await removeAllRefreshToken(sub)
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
            return
          }
          const refresh_expiry=rememberme?process.env.LONG_REFRESH_TOKEN_EXPIRES:process.env.REFRESH_TOKEN_EXPIRES
          const currentDate = new Date();
          const cookie_expires = moment(currentDate).add(refresh_expiry.match(/^(\d+)/)[1],'days').toDate();
          const new_access_token = 
          await issueToken(
            sub,
            role,
            email,
            rememberme,
            process.env.ACCESS_TOKEN_SECRET,
            process.env.ACCESS_TOKEN_EXPIRES
          )
          const new_refresh_token = rememberme
          ? await issueToken(
            sub,
            role,
            email,
            rememberme,
            process.env.REFRESH_TOKEN_SECRET,
            process.env.LONG_REFRESH_TOKEN_EXPIRES
          )
          : await issueToken(
            sub,
            role,
            email,
            rememberme, 
            process.env.REFRESH_TOKEN_SECRET,
            process.env.REFRESH_TOKEN_EXPIRES);
            
          await saveRefershToken(sub,new_refresh_token)
          console.log("new:"+ new_refresh_token)
          await removeRefreshToken(refresh_token)
          console.log("old:"+ refresh_token)
          await res.cookie('access_token',new_access_token, {
            path: "/",
            httpOnly:true,
            expires:cookie_expires,
            // secure: true,
          })
          await res.cookie('refresh_token',new_refresh_token, {
            path: "/",
            httpOnly:true,
            expires:cookie_expires,
            // secure: true,
          })
          req.user = {sub,email,role,rememberme}
          next() 
          return
      }

//refresh hoken handle
    catch(r_error){
      console.log("invlid refresh token")
      console.log(r_error)
      await removeRefreshToken(refresh_token)
      if (req.method == "GET") {
       if(req.url==='/checkout')
            {
            return res.redirect(
                "/login?invalid_token_error=" + encodeURIComponent("No-Auth-Redirect/checkout")
              );
            }
          return res.redirect(
            "/login?invalid_token_error=" + encodeURIComponent("No-Auth-Redirect")
          );
    }
    return
  }
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



