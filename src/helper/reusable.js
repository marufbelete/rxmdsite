const User = require("../models/userModel");
const Affiliate = require("../models/affiliateModel");
const { sendPayout } = require("../functions/paypal");

const removeEmptyPair=(obj)=> {
    for (let propName in obj) {
      if (!(obj[propName])) {
        delete obj[propName];
      }
    }
    return obj
}
const formatPhoneNumber=(phoneNumberString) =>{
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return  match[1] + '-' + match[2] + '-' + match[3];
  }
  return null;
}

const paypalAutoPay = async (userId,amount) => {
   const user=await User.findOne({where:{id:userId}});
   const batchId=Math.random().toString(36).substring(9)
   const note='TestRxmd affiliate payout'
   const payout=await sendPayout(user.email,Number(amount),note,batchId)
   await Affiliate.update({batchId:payout?.batch_header?.payout_batch_id,status:"pending"},
   {where:{affilatorId:userId,withdrawalType:"NA"}})
    return
 
}
module.exports={
    removeEmptyPair,
    paypalAutoPay,
    formatPhoneNumber
}