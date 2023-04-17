const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;

const generateWebhookSecretKey = async () => {
  const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.APILOGINID);
  merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);

  const request = new ApiContracts.CreateWebhookSecretRequest();
  request.setMerchantAuthentication(merchantAuthenticationType);

  const ctrl = new ApiControllers.CreateWebhookSecretController(request.getJSON());
//   ctrl.setEnvironment(SDKConstants.endpoint.production);
  const executeResponse = new Promise((resolve, reject) => {
    ctrl.execute((error, response) => {
      const apiResponse = ctrl.getResponse();
      const createResponse = new ApiContracts.CreateWebhookSecretResponse(apiResponse);
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
      const secretKey = response.getSecretKey();
      return secretKey;
    } else {
      handleError(response.getMessages().getMessage()[0].getText(), 403);
    }
  }
  console.log("payment gateway not responding", 404);
}
generateWebhookSecretKey()