const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
const SDKConstants = require('authorizenet').Constants;
const { handleError } = require("../helper/handleError");

const chargeCreditCard=async(paymentInfo)=>{
    const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(process.env.APILOGINID);
    merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);

        const creditCard = new ApiContracts.CreditCardType();
        creditCard.setCardNumber(paymentInfo.card_detail?.cardNumber);
        creditCard.setExpirationDate(paymentInfo.card_detail?.expirtationDate);
        creditCard.setCardCode(paymentInfo.card_detail?.cardCode);


        const paymentType = new ApiContracts.PaymentType();
        paymentType.setCreditCard(creditCard);

        const billTo = new ApiContracts.CustomerAddressType();
        billTo.setFirstName(paymentInfo.billing_detail?.firstName);
        billTo.setLastName(paymentInfo.billing_detail?.lastName);
        billTo.setAddress(paymentInfo.billing_detail?.address);
        billTo.setCity(paymentInfo.billing_detail?.city);
        billTo.setState(paymentInfo.billing_detail?.state);
        billTo.setZip(paymentInfo.billing_detail?.zip);
        billTo.setCountry(paymentInfo.billing_detail?.country);
        billTo.setEmail(paymentInfo.billing_detail?.email);

        const transactionRequestType = new ApiContracts.TransactionRequestType();
        transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
        transactionRequestType.setPayment(paymentType);
        transactionRequestType.setBillTo(billTo);
        transactionRequestType.setAmount(paymentInfo?.amount);

  const createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);
  
    const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
    // For PRODUCTION use the default is sandbox
    ctrl.setEnvironment(SDKConstants.endpoint.production);
    const Response = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const error = new Error('This process take longer than expected, please try again ');
        error.statusCode = 408;
        reject(error);
      }, 47000);
      ctrl.execute((error, res) => {
        clearTimeout(timeout);
        const apiResponse = ctrl.getResponse();

        const response = new ApiContracts.CreateTransactionResponse(apiResponse);
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
    if (Response != null) {
      if (Response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
        if(Response.getTransactionResponse().getMessages() != null){
          return Response.getTransactionResponse()
        }
        else {
					if(Response.getTransactionResponse().getErrors() != null){
						handleError(Response.getTransactionResponse().getErrors().getError()[0].getErrorText(),403);
					}
				}
      } else {
        if(Response.getTransactionResponse() != null && Response.getTransactionResponse().getErrors() != null){
          handleError(Response.getTransactionResponse().getErrors().getError()[0].getErrorText(),403);
        }
        else {
          handleError(Response.getMessages().getMessage()[0].getText(),403);
        }
      }
    }
    handleError("payment gatway not responding", 404);

}
module.exports={
  chargeCreditCard
}

