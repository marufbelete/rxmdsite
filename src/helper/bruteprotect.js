const bouncer = require("express-bouncer")(300000, 900000, 7);
bouncer.blocked = function (req, res, next, remaining) {
  return res
    .status(429)
    .json({
      message: `Too many login attempts, please wait ${Math.round(
        remaining / 60000
      )} minutes`,
    });
};
module.exports = bouncer;
