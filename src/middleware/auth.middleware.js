const jwt = require("jsonwebtoken");
const { handleError } = require("../helper/handleError");
const User = require("../models/userModel");
const util = require('util');
const asyncVerify = util.promisify(jwt.verify);
const {isRefreshTokenExist,removeRefreshToken,saveRefershToken,
  removeAllRefreshToken,issueToken}=require("../helper/user")
const authenticateJWT = async (req, res, next) => {
  const {access_token,refresh_token} = req.cookies;
  try {
    // const token = authHeader?.split(" ")[1];
    if (!access_token) {
      handleError("please login", 403);
    }
    const user = await asyncVerify(access_token, process.env.ACCESS_TOKEN_SECRET)
    if (user?.sub) {
      const check_user = await User.findByPk(user?.sub)
      if (!check_user?.isActive) {
        handleError("This account is inactive, please contact our customer service", 403);
      }
      //comporomised
      console.log(refresh_token)
      if(!(await isRefreshTokenExist(refresh_token,user?.sub)))
      {
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
      }
      req.user = user;
      next();
      return
    }
    handleError("please login", 403);

  } catch (error) {
    
    if (error instanceof jwt.TokenExpiredError) {
      console.log("expired")

      try{
          const {sub,email,role,rememberme}=await asyncVerify(refresh_token,process.env.REFRESH_TOKEN_SECRET)
          //compromised
          console.log(sub,email,role,rememberme)
          console.log(refresh_token)
          if(!(await isRefreshTokenExist(refresh_token,sub)))
          {
            console.log("not exist")
            await removeAllRefreshToken(sub)
            if (req.method == "GET") {
              console.log("get method")
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
            console.log("error mmmm")
            next(error)
            return
          }
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
          await Promise.all([saveRefershToken(sub,new_refresh_token),
          removeRefreshToken(refresh_token)])
          res.cookie('access_token',new_access_token, {
            path: "/",
            httpOnly:true,
            // secure: true,
          })
          res.cookie('refresh_token',new_refresh_token, {
            path: "/",
            httpOnly:true,
            // secure: true,
          })
          req.user = {sub,email,role,rememberme}
          next() 
          return
      }

//refresh hoken handle
    catch(r_error){
      console.log("both expired")
      await removeRefreshToken(refresh_token)
      if (req.method == "GET") {
        console.log("get method")

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
    console.log("next error")
    next(r_error)
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
      next(error)
      return
 }
};

module.exports = { authenticateJWT };



