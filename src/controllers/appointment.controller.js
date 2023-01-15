const User = require("../models/userModel");
const path = require("path");
const { formatPhoneNumber } = require('../helper/reusable')
const axios = require('axios');
const { create_client,config } = require("../functions/vcitafunc");

exports.getAppointment = async (req, res, next) => {
  try {
    const id = req.user.sub;
    const user = await User.findByPk(id, { include: ["role"] });
    const user_info = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: formatPhoneNumber(user.phone_number)
    }
    const token = req.cookies.access_token;
    console.log(user_info)
    return res.render(
      path.join(__dirname, "..", "/views/pages/appointment"),
      { user_info, token }
    );
  } catch (err) {
    next(err);
  }
};
exports.createClient = async (req, res, next) => {
  try {
     const response=await create_client();
     //save vcita client id to db
     return res.json(response)
  } catch (err) {
    console.log(err.response)
    next(err);
  }
};
exports.createAppointment = async (req, res, next) => {
  try {
           // comment this for test only
    // const id = req.user.sub;
    // const user = await User.findByPk(id);
    // let client_id=user.client_id
    // if(!user.client_id){
    // const client=await create_client();
    // user.client_id=client.id
    // await user.save()
    // client_id=client.id
    // }
    const data = {
        service_id: "b7e3onotccbodfml",
        staff_id:"160rl9jdj153rzzt",
        business_id:"iqx89rw1t8g4vwuh",
        client_id:"02xt1t7ge3o1j5r",
        start_time:'2022-12-01T10:00:00Z',
    };
    //send email about the appointment
    const response=await axios.post('https://api.vcita.biz/business/scheduling/v1/bookings', data, config)
    return res.json(response.data)
  } catch (err) {
    console.log(err?.response.data)
    next(err);
  }
};
// run the webhook when the server start
exports.subscribeWebhook = async (req, res, next) => {
  try {
const webhookUrl = 'https://rxmdsite-production.up.railway.app/webhook';
const event = 'appointment.create';

const data = {
  target_url: webhookUrl,
  events: event
};                                 
  const respoonse=await axios.post('https://api.vcita.biz/platform/v1/webhook/subscribe', data, config)
  console.log(respoonse.data)
 
}
catch (err) {
  console.log(err?.response.data)
  next(err);
}
}

exports.appointmentCreated = async (req, res, next) => {
  console.log(req)
  const token = req.query.jwt_token;
  const secret = 'your_secret_key';
  console.log(token)
  try {
    const decoded = jwt.verify(token, secret);
    console.log(decoded);
  }
catch (err) {
  console.log(err?.response.data)
  next(err);
}
}

