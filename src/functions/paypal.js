const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', // Change to 'live' for production
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

const sendPayout=(email, amount, note)=> {
  const payout = {
    'sender_batch_header': {
      'sender_batch_id': Math.random().toString(36).substring(9),
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
const paypalVerifyHook=(req)=>{
const webhookEvent = req.headers['paypal-transmission-sig'];
const webhookTransmissionId = req.headers['paypal-transmission-id'];
// const webhookId = req.headers['paypal-webhook-id'];
const webhookBody = JSON.stringify(req.body);
console.log(webhookEvent)
console.log(webhookTransmissionId)
console.log(webhookBody)
// console.log(webhookId )
const signature = req.headers;
console.log(signature)
const eventBody = req.body;
console.log(req.body.id)
paypal.notification.webhookEvent.verify(signature,eventBody, req.body.id,function (error, response) {
  if (error) {
    console.log("error")
    console.error(error);
    console.error(error.details);
    return false
  } 
  console.log(response)
  return true
});
}

const paypalWebhook=()=> {
  paypal.notification.webhook.create({
    url: 'https://815a-197-156-107-255.ngrok-free.app/subscription',
    event_types: [
      {
        name: "PAYMENT.PAYOUTSBATCH.PROCESSING"
      }
    ]
  }, (error, webhook) => {
    if (error) {
      console.error('Error creating webhook subscription:', error);
    } else {
      console.log('Webhook subscription created:', webhook);
    }
  });
}
// paypalWebhook()
module.exports={
    sendPayout,
    paypalWebhook,
    paypalVerifyHook
}
