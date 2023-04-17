const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
const SDKConstants = require('authorizenet').Constants;
const EVENT_CREATE={
    "SUBSCRIPTION_CREATED":ApiContracts.EventTypeEnum.SUBSCRIPTION_CREATED,
    "SUBSCRIPTION_CANCELLED":ApiContracts.EventTypeEnum.SUBSCRIPTION_CANCELLED,
    "SUBSCRIPTION_EXPIRING":ApiContracts.EventTypeEnum.SUBSCRIPTION_EXPIRING,
    "SUBSCRIPTION_SUSPENDED":ApiContracts.EventTypeEnum.SUBSCRIPTION_SUSPENDED,
    "SUBSCRIPTION_TERMINATED":ApiContracts.EventTypeEnum.SUBSCRIPTION_TERMINATED,
    "SUBSCRIPTION_FAILED":ApiContracts.EventTypeEnum.SUBSCRIPTION_FAILED,
    "SUBSCRIPTION_SUCCESSFUL":ApiContracts.EventTypeEnum.SUBSCRIPTION_SUCCESSFUL,
}
const events=[
  EVENT_CREATE.SUBSCRIPTION_CREATED,
  EVENT_CREATE.SUBSCRIPTION_CANCELLED,
  EVENT_CREATE.SUBSCRIPTION_FAILED,
  EVENT_CREATE.SUBSCRIPTION_TERMINATED,
  EVENT_CREATE.SUBSCRIPTION_SUSPENDED,
  EVENT_CREATE.SUBSCRIPTION_SUCCESSFUL,
  EVENT_CREATE.SUBSCRIPTION_EXPIRING,
]
const createWebhook = async (endpointUrl, secretKey, events) => {
  const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.APILOGINID);
  merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);

  const webhook = new ApiContracts.CreateWebhookRequest();
  webhook.setMerchantAuthentication(merchantAuthenticationType);
  webhook.setUrl(endpointUrl);
  webhook.setSecret(secretKey);

  webhook.setEvents(events);
  const ctrl = new ApiControllers.CreateWebhookController(webhook.getJSON());
  // ctrl.setEnvironment(SDKConstants.endpoint.production);
  const executeResponse = new Promise((resolve, reject) => {
    ctrl.execute((error, response) => {
      const apiResponse = ctrl.getResponse();
      const createResponse = new ApiContracts.CreateWebhookResponse(apiResponse);
      if (error) {
        reject(error);
      } else {
        resolve(createResponse);
      }
    });
  });
  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      const error = new Error('This process take longer than expected, please try again ');
      error.statusCode = 408;
      reject(error);
    }, 47000);
  });
  const response = await Promise.race(executeResponse, timeout);
  if (response != null) {
    if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
      const webhookId = response.getWebhookId();
      return webhookId;
    } else {
      console.log(response.getMessages().getMessage()[0].getText(), 403);
    }
  }
  console.log("payment gateway not responding", 404);
}
createWebhook(url,process.env.WEBHOOK_SECRET,events)