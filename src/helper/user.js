const User = require("../models/userModel");
const Role=require("../models/roleModel")
const PaymenInfo=require("../models/paymentInfoModel")
const Subscription=require("../models/subscriptionModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const speakeasy = require('speakeasy');

const {createSubscriptionFromCustomerProfile}=require('../functions/handlePayment');
const Affiliate = require("../models/affiliateModel");
const Product = require("../models/productModel");
const Appointment = require("../models/appointmentModel");
const isEmailExist = async (email) => {
  const user = await User.findOne({
    where: { email: email },
    include: ["role"],
  });
  return user;
};

const isPasswordCorrect = async (incomingPassword, existingPassword) => {
  const isMatch = await bcrypt.compare(incomingPassword, existingPassword);
  return isMatch;
};

const get2faVerfication = async (userId) => {
  const user=await User.findByPk(userId)
  let secret
  if(!user.twoFaSecret) {
  const newSecret = speakeasy.generateSecret();
  await User.update({ twoFaSecret: newSecret.base32 }, { where: { email: user.email }});
  secret=newSecret.base32
  }
  else{
    secret=user.twoFaSecret
  }
  const otp = speakeasy.totp({
    secret: secret,
    encoding: 'base32',
    window: 180 //in second
  });
  return otp

};
const verify2faVerfication = async (otp,userId) => {
  const user=await User.findByPk(userId)
  const isValid = speakeasy.totp.verify({
    secret: user.twoFaSecret,
    encoding: 'base32',
    token: otp, 
    window: 300 
  });
  return isValid
};
const deemAffiliate=async(batch_id)=>{
  await Affiliate.update({withdrawalType:"cash",status:"paid"},
    {where:{batchId:batch_id}})
}
const generateOtp=async(userId)=>{
  const otp=await get2faVerfication(userId)
  return otp
}
const getAffiliatePayableAmount=async(userId)=>{
  console.log(userId)
   const result = await Affiliate.sum('amount', {
    where: { affilatorId:userId, withdrawalType:"NA", status:"not paid"}
  });
  //  await Affliate.findOne({
  //   attributes: [
  //     [sequelize.literal('SUM(amount)'), 'totalAmount']
  //   ],
  //   where: { affilatorId:userId, isDeemed: false }
  // });
  console.log(result);
  console.log("total paid")
  return result
}
//check which data to sign
const issueToken = async function (id, role,email,rememberme, key,expirey) {
  const token = jwt.sign({ sub: id, role,email,rememberme }, key, { expiresIn: expirey });
  return token;
};
const getProviders= async()=>{
  const provider=await User.findAll({include:[{
    model:Role,
    where:{role:"provider"}
   }]})
   return provider
}

const isTokenValid = async function (token,secret) {
  const user = jwt.verify(token,secret, (err, user) => {
    if (err) {
      return null;
    }
    return user;
  });
  return user;
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

const isUserAdmin = (req) => {
  if (req?.user?.role === "admin") {
    return true;
  }
  return false;
};

const isEmailVerified = async (email) => {
  const user = await User.findOne({ where: { email: email } });
  return user?.isEmailConfirmed;
};

const userIp = (request) => {
  let ip = request.headers["x-forwarded-for"] || request.socket.remoteAddress;
  return ip;
};

const isIntakeFormComplted = async (req) => {
  const id = req?.user?.sub;
  const user = await User.findOne({ where: { id } });
  if (user?.intake) {
    return true;
  }
  return false;
};
const createSubscription = async (req) => {
  // const user_id = req?.user?.sub;
  console.log(req.body)
  //change here in dev
  const {paymentId,productId,user_id}=req.body

  const {userProfileId,userProfilePaymentId} = await PaymenInfo.findOne(
  { where: { userId:user_id,id:paymentId } });
  if(userProfileId && userProfilePaymentId){
  const subscriptionId=await createSubscriptionFromCustomerProfile(
    userProfileId,
  userProfilePaymentId)
  return await Subscription.create({
    productId:productId,
    userId:user_id,
    userSubscriptionId:subscriptionId
  })
}
  return null
};
const getUser=async(id)=>{
  const user=User.findByPk(id)
  return user
}
const getProductType=async(options={})=>{
  const product=await Product.findAll({
    ...options,where:{type:'product'}});
  return product
}
const getTreatmentType=async(options={})=>{
  const treatment=await Product.findAll({
    ...options,where:{type:'treatment'}});
  return treatment
}
const getAppointmentsByFilter=async(options)=>{
  const appointments=await Appointment.findAll(options)
  return appointments
}
const getAppointmentByFilter=async(options)=>{
  const appointment=await Appointment.findOne(options)
  return appointment
}
const appointmentUnpaidExist = async(sub,option={}) => {
  const appointment=await Appointment.findOne({where:{
    paymentStatus:false,
    patientId:sub,
    ...option
  }})
  return appointment;
};

module.exports = {
  isEmailExist,
  isPasswordCorrect,
  isEmailVerified,
  issueToken,
  hashPassword,
  userIp,
  isUserAdmin,
  isTokenValid,
  isIntakeFormComplted,
  createSubscription,
  get2faVerfication,
  verify2faVerfication,
  getAffiliatePayableAmount,
  deemAffiliate,
  generateOtp,
  getUser,
  getProductType,
  getTreatmentType,
  getProviders,
  getAppointmentsByFilter,
  getAppointmentByFilter,
  appointmentUnpaidExist,
  
};
