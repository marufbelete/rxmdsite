const User = require("../models/userModel");
const path = require("path");
// const { formatPhoneNumber } = require('../helper/reusable')
// const axios = require('axios');
// const { config} = require("../functions/vcitafunc");

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

  //we will use it if the token thing is possible

// exports.subscribeWebhook = async () => {
// const webhookUrl = 'https://rxmdsite-production.up.railway.app/vcitawebhook';
// const event = 'appointment/requested';
// const data = {
//   target_url: webhookUrl,
//   event: event
// };                                 
//   await axios.post('https://api.vcita.biz/platform/v1/webhook/subscribe', data, config)
//   return
// }

// exports.appointmentCreatedWebhook = async (req, res, next) => {
//   console.log("appointment created")
//   console.log(req.body)
//   const token = req.query;
//   const head = req.headers;
//   console.log(head)
//       //change user info
// try {
//   // const user=User.findAll({where:{}})
//   // user.left_appointment=left_appointment-1
//   // await user.save()
//   // const secret = 'your_secret_key';
//   console.log(token);
//     // const decoded = jwt.verify(token, secret);
//     console.log(decoded);
//     return
//   }
// catch (err) {
//   next(err);
// }
// }

