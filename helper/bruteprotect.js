const bouncer = require ("express-bouncer")(300000, 900000,7);
bouncer.blocked = function (req, res, next, remaining)
{
    return res.status(429).
    json ({message:`You have end you login attempt, please wait ${Math.round((remaining / 60000))} minutes`});
};
module.exports=bouncer