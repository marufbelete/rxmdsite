const paypal = require('paypal-rest-sdk');
const {deemAffiliate}=require('../helper/user')
const webhook_id='7UD57517YE703002N'
paypal.configure({
  'mode': 'sandbox', // Change to 'live' for production
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

const sendPayout=(email, amount, note,batchId)=> {
  const payout = {
    'sender_batch_header': {
      'sender_batch_id':batchId ,
      'email_subject': 'You have a payment from TestRXMD'
    },
    'items': [{
      'recipient_type': 'EMAIL',
      'amount': {
        'value': amount,
        'currency': 'USD'
      },
      'note': note,
      'receiver': email,
      'sender_item_id': Math.random().toString(36).substring(9)
    }]
  };

  return new Promise((resolve, reject) => {
    paypal.payout.create(payout, (error, payout) => {
      if (error) {
        reject(error);
      } else {
        resolve(payout);
      }
    });
  });
}
const paypalVerifyHook=async(req)=>{
const signature = req.headers;
const eventBody = req.body;
const batchId=eventBody.resource.batch_header.payout_batch_id
const verify=await new Promise((resol,rej)=>{
paypal.notification.webhookEvent.verify(signature,eventBody,webhook_id,async function (error, response) {
  if (error) {
    rej(false)
  } 
  //paid successfully
  if(response.verification_status==='SUCCESS'){
    if(eventBody.resource.batch_header.batch_status==='SUCCESS'
    && eventBody.event_type==='PAYMENT.PAYOUTSBATCH.SUCCESS'){
     deemAffiliate(batchId)
    }
}
  resol(true)
});
})
return {verify,amount:eventBody.resource.batch_header.amount,batchId}
}

module.exports={
    sendPayout,
    paypalVerifyHook
}
