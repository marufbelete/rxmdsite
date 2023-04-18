const User = require("../models/userModel");
const Role = require("../models/roleModel");
const { issueToken, saveRefershToken } = require("../helper/user");
const { Op } = require("sequelize");
const passportGoogle = require("passport-google-oauth20");
const GoogleStrategy = passportGoogle.Strategy;
exports.googlePassport = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const user_role = await Role.findOne({ where: { role: "user" } });
          const userInfo = {
            first_name: profile?._json?.given_name,
            last_name: profile?._json?.family_name,
            email: profile?._json?.email,
            roleId: user_role?.id,
            googleId: profile?._json?.sub,
            isEmailConfirmed: profile?._json?.email_verified,
          }; 
          const user = await User.findOrCreate({
            where: {
              [Op.or]: [
                { googleId: userInfo.googleId },
                { email: userInfo.email },
              ],
            },
            defaults: userInfo,
            include: ["role"],
          });
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
};
exports.issueGoogleToken = async (req, res, next) => {
  try {
    if(!req?.user[0]?.isActive){
      return res.redirect(
        "/login?error=" + encodeURIComponent("Google-Account-Not-Active")
      );      }
    if (req?.user[0]?.isLocalAuth) {
      return res.redirect(
        "/login?error=" + encodeURIComponent("Google-Auth-Not-Exist")
      );
    }
    const access_token = await issueToken(
      req?.user[0]?.id,
      req?.user[0]?.role?.role,
      req?.user[0]?.email,
      false,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRES
    );
    const refresh_token=await issueToken(
      req?.user[0]?.id,
      req?.user[0]?.role?.role,
      req?.user[0]?.email,
      false,
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_EXPIRES);

      res.cookie("access_token", access_token, {
        path: "/",
        httpOnly:true,
        // secure: true,
      })
      res.cookie("refresh_token", refresh_token, {
        path: "/",
        httpOnly:true,
        // secure: true,
      })
      await saveRefershToken(req?.user[0]?.id,refresh_token)
      if(req?.user[0]?.intake) return res.redirect("/")
      return res.redirect("/?intakeFilled=" + encodeURIComponent("false"));
  } catch (err) {
    next(err);
  }
};
