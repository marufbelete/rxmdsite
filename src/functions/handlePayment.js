const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;

// new test
const chargeCreditCard=async()=>{
  console.log(process.env.APILOGINID,process.env.TRANSACTIONKEY)
    const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(process.env.APILOGINID);
    merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);

        const creditCard = new ApiContracts.CreditCardType();
        creditCard.setCardNumber('4242424242424242');
        creditCard.setExpirationDate('0822');
        creditCard.setCardCode('999');

        const paymentType = new ApiContracts.PaymentType();
        paymentType.setCreditCard(creditCard);

        const billTo = new ApiContracts.CustomerAddressType();
        billTo.setFirstName('Ellen');
        billTo.setLastName('Johnson');
        billTo.setCompany('Souveniropolis');
        billTo.setAddress('14 Main Street');
        billTo.setCity('Pecan Springs');
        billTo.setState('TX');
        billTo.setZip('44628');
        billTo.setCountry('USA');
        //setting
        // const transactionSetting = new ApiContracts.SettingType();
        // transactionSetting.setSettingName('duplicateWindow');
        // transactionSetting.setSettingValue('120');

        const transactionRequestType = new ApiContracts.TransactionRequestType();
        transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
        transactionRequestType.setPayment(paymentType);
        transactionRequestType.setBillTo(billTo);
        transactionRequestType.setAmount(123.45);
        // transactionRequestType.setTransactionSettings(transactionSetting);




  const createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

    const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
    console.log(ctrl)
    console.log("payment in progress")
    // const apiResponse = await ctrl.execute();
    const apiResponse = await new Promise((resolve, reject) => {
      ctrl.execute((error, responses) => {
        let apiResponse = ctrl.getResponse();
        let response = new ApiContracts.CreateTransactionResponse(apiResponse);
        if (error) {
          console.log("error")

          console.log(error)
          reject(error);
        } else {
          console.log("success")
          console.log(response)
          resolve(response);
        }
      });
    });
    console.log(apiResponse)
    const response = new ApiContracts.CreateTransactionResponse(apiResponse);
    if (response != null) {
      console.log(response.getMessages())
      if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
        console.log(response.getTransactionResponse())
        console.log("payment success")
        // Transaction was successful
      } else {
        console.log(response.getTransactionResponse())
        console.log("payment fail")
        
        // Transaction failed
      }
    }
    // await util.promisify(ctrl.execute(function(){
    //   var apiResponse = ctrl.getResponse();
    //   var response = new ApiContracts.CreateTransactionResponse(apiResponse);
    
    //   if (response != null) {
    //     if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
    //       // Transaction was successful
    //       console.log(response.getTransactionResponse())
    //     } else {
    //       // Transaction failed
    //       console.log(response.getTransactionResponse())
    //     }
    //   }
    // }));
    
  
}
module.exports={
  chargeCreditCard
}
// console.log(process.env.APILOGINID)
// const handlePayment = async () => {
//   // try {
//     const paymentRequest = {
//       amount: '10.99',
//       cardNumber: '4111111111111111',
//       expirationDate: '12/2022',
//       cardCode: '123',
//       billingAddress: {
//         firstName: 'John',
//         lastName: 'Doe',
//         address: '123 Main St',
//         city: 'Anytown',
//         state: 'NY',
//         zip: '12345',
//         country: 'USA'
//       }
//     };
//     const response = await authNet.createTransaction(
//       'authorizeCaptureTransaction',
//       paymentRequest
//     );
//     console.log(response);
//     return response
// }