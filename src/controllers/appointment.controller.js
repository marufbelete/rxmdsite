const User = require("../models/userModel");
const path = require("path");

exports.getAppointment = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    await User.update({
      left_appointment:false},
     {where:{id:req?.user?.sub}})
    return res.render(
      path.join(__dirname, "..", "/views/pages/appointment"),{token});
  } catch (err) {
    next(err);
  }
};
