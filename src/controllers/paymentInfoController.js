const PaymentInfo = require("../models/paymentInfoModel");
const {handleEvent,verifySignature}=require('../functions/paymentListenWebhook')
const {  createSubscription
}=require('../helper/user') 
const sequelize = require("../models/index");
const { handleError } = require("../helper/handleError");


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
exports.createPaymentSubscription = async (req, res, next) => {
  try {
    const subscription=await createSubscription(req,)
    if(subscription)return res.json({message:"subscription success"})
    handleError("payment information not found",403)
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

