const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;

// new test
const chargeCreditCard=async(paymentInfo)=>{
  console.log(process.env.APILOGINID,process.env.TRANSACTIONKEY)
    const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(process.env.APILOGINID);
    merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);

        const creditCard = new ApiContracts.CreditCardType();
        creditCard.setCardNumber(paymentInfo.card_detail?.cardNumber);
        creditCard.setExpirationDate(paymentInfo.card_detail?.expirtationDate);
        creditCard.setCardCode(paymentInfo.card_detail?.cardCode);
        creditCard.setFirstName(paymentInfo.card_detail?.firstName);
        creditCard.setLastName(paymentInfo.card_detail?.lastName);

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
        //setting
        // const transactionSetting = new ApiContracts.SettingType();
        // transactionSetting.setSettingName('duplicateWindow');
        // transactionSetting.setSettingValue('120');

        const transactionRequestType = new ApiContracts.TransactionRequestType();
        transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
        transactionRequestType.setPayment(paymentType);
        transactionRequestType.setBillTo(billTo);
        transactionRequestType.setAmount(paymentInfo?.amount);
        // transactionRequestType.setTransactionSettings(transactionSetting);

  const createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

    const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
    const Response = await new Promise((resolve, reject) => {
      ctrl.execute((error, res) => {
        const apiResponse = ctrl.getResponse();
        console.log(apiResponse)
        const response = new ApiContracts.CreateTransactionResponse(apiResponse);
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
    // console.log(apiResponse.messages)
    // console.log(apiResponse.transactionResponse.errors)
    // const settleAmount = Response.getTransactionResponse().getSettleAmount();
    // console.log(settleAmount)
    if (Response != null) {
      console.log("response is not null")
      console.log(Response.getMessages())
      if (Response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
        console.log("payment success")
        return Response.getTransactionResponse()
        // Transaction was successful
      } else {
        console.log(Response.getTransactionResponse())
        console.log("payment fail")
        // throw error
        // Transaction failed
      }
    }
  
}
module.exports={
  chargeCreditCard
}
