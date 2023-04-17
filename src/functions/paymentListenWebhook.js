const crypto = require('crypto');
const fs=require('fs')

exports.authorizenetWebhookListen=(req, res) => {
  const signature = req.headers['x-anet-signature'];
  const event = req.body;
  try{
  const isValid = verifySignature(signature, JSON.stringify(event));
  if (isValid) {
    handleEvent(event);
    res.sendStatus(200);
  }
  else{
    fs.writeFile('malciuos_net_webhook.txt',JSON.stringify(event))
  }
 } 
 catch(err){
console.log(err)
 }
};

const verifySignature = (signature, body) => {
  const hmac = crypto.createHmac('sha512', process.env.WEBHOOK_SECRET);
  hmac.update(body);
  const digest = hmac.digest('base64');
  return signature === digest;
};

const handleEvent = (event) => {
  const eventType = event.eventType;
  const payload = event.payload;
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