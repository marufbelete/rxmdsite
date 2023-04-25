const User = require("../models/userModel");
const PaymenInfo=require("../models/paymentInfoModel")
const Subscription=require("../models/subscriptionModel")
const RefreshToken=require("../models/refreshToken.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const speakeasy = require('speakeasy');

const {createSubscriptionFromCustomerProfile}=require('../functions/handlePayment')
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
    window: 300 //in second
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

//check which data to sign
const issueToken = async function (id, role,email,rememberme, key,expirey) {
  const token = jwt.sign({ sub: id, role,email,rememberme }, key, { expiresIn: expirey });
  return token;
};

const saveRefershToken=async(userId,refresh_token)=>{
  const refreshToken=new RefreshToken({
    userId,
    token:refresh_token
  })
  await refreshToken.save()
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
const isRefreshTokenExist=async(refreshToken,userId)=>{
  const token=await RefreshToken.findOne({where:
  {userId:userId,token:refreshToken}})
  return token
}
 const removeRefreshToken=async(refreshToken,options = {})=>{
    await RefreshToken.destroy({where:{token:refreshToken},...options})
}
const removeAllRefreshToken=async(userId,options = {})=>{
  return await RefreshToken.destroy({where:{userId},...options})
}

module.exports = {
  isEmailExist,
  isPasswordCorrect,
  isEmailVerified,
  issueToken,
  hashPassword,
  userIp,
  saveRefershToken,
  isUserAdmin,
  isTokenValid,
  isIntakeFormComplted,
  isRefreshTokenExist,
  removeRefreshToken,
  removeAllRefreshToken,
  createSubscription,
  get2faVerfication,
  verify2faVerfication
};
