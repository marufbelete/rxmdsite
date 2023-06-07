
const paypal = require('paypal-rest-sdk');
const PAYPAL_CLIENT_ID="cli_id"
const PAYPAL_CLIENT_SECRET="cli_sec"
paypal.configure({
  'mode': 'sandbox', // Change to 'live' for production
  'client_id': PAYPAL_CLIENT_ID,
  'client_secret': PAYPAL_CLIENT_SECRET
});
const paypalWebhook=()=> {
    paypal.notification.webhook.create({
      url: 'https://shielded-citadel-34904.herokuapp.com/paypalsubscription',
      event_types: [
        {
          name: "PAYMENT.PAYOUTSBATCH.SUCCESS"
        }
      ]
    },(error, webhook) => {
      if (error) {
        console.error('Error creating webhook subscription:', error);
      } else {
        console.log('Webhook subscription created:', webhook);
      }
    });
  }
  paypalWebhook()