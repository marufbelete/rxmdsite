const paypalWebhook=()=> {
    paypal.notification.webhook.create({
      url: 'https://64cf-196-191-221-194.ngrok-free.app/subscription',
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