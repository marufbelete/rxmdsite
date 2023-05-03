const PaymentInfo = require("../models/paymentInfoModel");
const {handleEvent,verifySignature}=require('../functions/paymentListenWebhook')
const {  createSubscription,get2faVerfication,verify2faVerfication, getAffiliatePayableAmount,
}=require('../helper/user') 
const {getInvoiceURL}=require('../functions/handlePayment')
const {sendEmail,sendOtpEmail, sendAffiliatePaidEmail}=require('../helper/send_email')
const { handleError } = require("../helper/handleError");
const {sendPayout, paypalWebhook, paypalVerifyHook}=require('../functions/paypal');
const Affliate = require("../models/affiliateModel");

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
// exports.createPay = async (req, res, next) => {
//   console.log('pay for affiliate')
//   try {
//     const resp=await sendPayout("marufbelete9@gmail.com",10,"your bonus from TestRxmd")
//     Affliate.update()
//     return res.json(resp)
//   }
//   catch(err){
//     console.log(err)
//    next(err)
//   }
// }
exports.paypalWebhookVerify = async (req, res, next) => {
  try {
    const {verify,amount,batchId}=await paypalVerifyHook(req)
    console.log(verify,amount)
    if(verify) 
    {
      const user=await Affliate.findOne({where:{batchId},include:['affilator']})
      console.log(user)
      console.log(user?.affilator?.email,user?.affilator?.first_name,amount)
      sendAffiliatePaidEmail(user?.affilator?.email,user?.affilator?.first_name,amount).
      then(r=>r).catch(e=>console.log(e))
      return res.status(200).json({status:true})
    }
  }
  catch(err){
    console.log(err)
    return res.status(401).json({status:false})
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
exports.getAffiliateTotalAmount = async (req, res, next) => {
  try {
   const amount= await getAffiliatePayableAmount(req?.user?.sub)
   return res.json({amount})
 
  }
  catch(err){
    console.log(err)
   next(err)
  }
}
