const PaymentInfo = require("../models/paymentInfoModel");
const {handleEvent,verifySignature}=require('../functions/paymentListenWebhook')
const {  createSubscription,get2faVerfication,verify2faVerfication,
}=require('../helper/user') 
const {getInvoiceURL}=require('../functions/handlePayment')
const {sendEmail,sendOtpEmail}=require('../helper/send_email')
const sequelize = require("../models/index");
const { handleError } = require("../helper/handleError");
const {sendPayout, paypalWebhook, paypalVerifyHook}=require('../functions/paypal')

exports.getAllMyPaymentInfo = async (req, res, next) => {
  try {
    const payments = await PaymentInfo.findAll({where:{userId:req?.user?.sub}});
    console.log(payments)
    return res.json(payments);
  } catch (err) {
    console.log(err)
    next(err);
  }
};
exports.createPay = async (req, res, next) => {
  console.log('pay for affiliate')
  try {
    const resp=await sendPayout("marufbelete9@gmail.com",10,"your bonus from TestRxmd")
    return res.json(resp)
  }
  catch(err){
    console.log(err)
   next(err)
  }
}
exports.createPaymentSubscription = async (req, res, next) => {
  try {
    console.log('check webhook')
    if(!paypalVerifyHook(req)) return res.json({status:false})
  //  const webh= paypalWebhook()
  //  console.log(webh)
  //   console.log('check invoice')
    // const resp=await sendPayout("marufbelete9@gmail.com",10,"your bonus from TestRxmd")
    // return res.json(resp)
    // await addRecipient("marufbelete9@gmail.com","maruf","belete")
    // const {userProfileId,userPaymentProfileId}=req.body
    //  await getInvoiceURL(userProfileId,userPaymentProfileId)
    // const subscription=await createSubscription(req)
    // if(subscription)return res.json({message:"subscription success"})
    // handleError("payment information not found",403)
  }
  catch(err){
    console.log(err)
   next(err)
  }
}
exports.paymentWebhook=(req, res) => {
  const signature = req.headers['x-anet-signature'];
  console.log(req.body)
  const event = JSON.parse(req.body.toString());
  console.log(event)
  console.log(signature)
  try{
  const isValid = verifySignature(signature.toLowerCase(), JSON.stringify(event));
  console.log(isValid)
  if (isValid) {
    handleEvent(event);
    return res.status(200);
  }
 return res.status(200).json({message:"success"})
 } 
 catch(err){
console.log(err)
 }
};

