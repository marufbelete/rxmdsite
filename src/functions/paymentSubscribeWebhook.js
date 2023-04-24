const createWebhook = async () => {
  const auth_webhook="5KP3u95bQpv:346HZ32z3fP4hTG2"
  auth_webhook.toString()
  const auth_webhook_buffer=Buffer.from(auth_webhook,'utf-8')
  const base_64_key=auth_webhook_buffer.toString('base64')
  // const url = "https://apitest.authorize.net/rest/v1/webhooks";
  const url = "https://apitest.authorize.net/rest/v1/webhooks";
  
  const options = {
    method: "POST",
    // method: "GET",
    headers: {
      "Authorization": `Basic ${base_64_key}`
    },
    body:JSON.stringify({
        "name": "My New Webhook",
        "url": "https://2f1f-196-190-60-131.ngrok-free.app/paymentwebhook",
        "eventTypes": [
          "net.authorize.payment.authcapture.created",
          "net.authorize.customer.subscription.created",
          "net.authorize.customer.subscription.updated",
          "net.authorize.customer.subscription.cancelled",
          "net.authorize.customer.subscription.expiring",
          "net.authorize.customer.subscription.terminated",
          "net.authorize.customer.subscription.expired",
          "net.authorize.customer.subscription.failed",
        ],
        "status": "active"
      
    })
  };
  const respon=await fetch(url,options)
  const data=await respon.json()
  console.log(data)
}
createWebhook()
