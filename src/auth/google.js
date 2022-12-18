const User = require("../models/userModel");
const { issueToken } = require('../helper/user');
const { Op } = require('sequelize')
const passportGoogle = require('passport-google-oauth20');
const GoogleStrategy = passportGoogle.Strategy
exports.googlePassport = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const userInfo = {
          first_name: profile._json.given_name,
          last_name: profile._json.family_name,
          email: profile._json.email,
          googleId: profile._json.sub,
          isEmailConfirmed: profile._json.email_verified
        }
        const user = await User.findOrCreate({
          where: {
            [Op.or]: [{ googleId: userInfo.googleId },
            { email: userInfo.email }]
          }, defaults: userInfo
        })
        done(null, user)
      }
      catch (err) {
        done(err, null)

      }
    }
  ));
}
exports.issueGoogleToken = async (req, res, next) => {
  try {
    const token = await issueToken(req.user.id, req.user.role, process.env.SECRET)
    return res.redirect(`http://localhost:7000/dashboard?token=${token}`);
  }
  catch (err) {
    next(err)
  }
}