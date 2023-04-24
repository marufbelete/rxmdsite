const crypto = require('crypto');

const verifySignature = (signature, body) => {
  const hmac = crypto.createHmac('sha512', process.env.WEBHOOK_SECRET);
  hmac.update(body);
  const digest = 'sha512=' + hmac.digest('hex');
  // hmac.digest('base64');
  // const signatureWithoutPrefix = signature.replace('sha512=', '');
  console.log(digest)
  console.log(signature)
  return signature === digest;
};

const handleEvent = (event) => {
  const eventType = event.eventType;
  const payload = event.payload;
  console.log(eventType)
  switch (eventType) {
    case 'net.authorize.customer.subscription.created':
      //manage the case
      console.log(`Subscription created: ${payload.id}`);
      break;
    case 'net.authorize.customer.subscription.updated':
      //manage the case
      console.log(`Subscription updated: ${payload.id}`);
      break;
    case 'net.authorize.customer.subscription.cancelled':
      //manage the case
      console.log(`Subscription cancelled: ${payload.id}`);
      break;
    case 'net.authorize.customer.subscription.expiring':
      //manage the case
      console.log(`Subscription expiring: ${payload.id}`);
      break;
    case 'net.authorize.customer.subscription.suspended':
      //manage the case
      console.log(`Subscription suspended: ${payload.id}`);
      break;
    case 'net.authorize.customer.subscription.terminated':
      //manage the case
      console.log(`Subscription terminated: ${payload.id}`);
      break;
    case 'net.authorize.customer.subscription.failed':
      //manage the case
      console.log(`Subscription failed: ${payload.id}`);
      break;
    case 'net.authorize.customer.subscription.successful':
      //manage the case
      console.log(`Subscription successful: ${payload.id}`);
      break;
    default:
      console.log(`Unknown event type: ${eventType}`);
  }
};

module.exports={
  verifySignature,
  handleEvent
}