
const User = require("../models/userModel");
const path = require("path");
const {formatPhoneNumber}=require('../helper/reusable')
exports.getAppointment = async (req, res, next) => {
    try {
        const id = req.user.sub;
        const user = await User.findByPk(id, { include: ["role"] });
        const user_info={
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            phone_number:formatPhoneNumber(user.phone_number)
        }
        console.log(user_info)
        return res.render(
        path.join(__dirname, "..", "/views/pages/appointment"),
        { user_info}
      );
      return res.json(user);
    } catch (err) {
      next(err);
    }
  };
// , function (req, res) {
//     res.render(path.join(__dirname, "..", "/views/pages/appointment"));
//   }