const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', // Change to 'live' for production
  'client_id': 'AUXZFHbTDkDAbTYiKQd2c7YTkisrgDi9XruTaLwhW31GVFV_DLVDixCIr-yyahXXuyJSCDxzObRn75X5',
  'client_secret': 'ECD2ANIRZz_YdJ8raDhWrbucdIFq5q4gARoSaA2KrtN8yCa1UwVT2U_g9tUjIoWHChJt-Ajjs5rq5kXn'
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
const webhookId = req.headers['paypal-webhook-id'];
const webhookBody = JSON.stringify(req.body);
console.log(webhookEvent)
console.log(webhookTransmissionId)
console.log(webhookBody)
console.log(webhookId )
console.log(req.headers)
paypal.notification.webhookEvent.verify(webhookEvent, webhookId, webhookBody, function (error, response) {
  if (error) {
    console.error(error);
    return false
  } 
  return true
});
}

const paypalWebhook=()=> {
  paypal.notification.webhook.list({
    // url: 'https://example.com/webhook',
    // event_types: [
    //   {
    //     name: "PAYMENT.PAYOUTSBATCH.SUCCESS"
    //   }
    // ]
  }, (error, webhook) => {
    if (error) {
      console.error('Error creating webhook subscription:', error);
    } else {
      console.log('Webhook subscription created:', webhook);
    }
  });
}

module.exports={
    sendPayout,
    paypalWebhook,
    paypalVerifyHook
}
