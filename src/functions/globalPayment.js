const axios = require('axios');
const GLOBAL_PAY_URL = 'https://apis.sandbox.globalpay.com/ucp';
// const GLOBAL_PAY_URL = 'https://apis.globalpay.com/ucp';
const crypto = require('crypto');
const { handleError } = require('../helper/handleError');

function sha512(input) {
  const hash = crypto.createHash('sha512');
  hash.update(input);
  return hash.digest('hex');
}

const getAccessToken=async()=>{
   const nonce = new Date().toISOString();
   const plaintext = `${nonce}${process.env.GLOBAL_PAY_SECRET}`;
   const secret = sha512(plaintext);

   const access_data = {
        app_id: process.env.GLOBAL_PAY_APP_ID,
        secret,
        grant_type: "client_credentials",
        nonce
    }
    const headers = {
        'Content-Type': 'application/json',
        'X-GP-Version': '2021-03-22'
      };
        const response = await axios.post(`${GLOBAL_PAY_URL}/accesstoken`,access_data, { headers });
       return response.data.token
}
const checkCodeError=(response)=>{
  if(response.data?.payment_method?.result=='101'||
  response?.data.payment_method?.result=='102' ||
  response?.data.payment_method?.result=='103'||
  response?.data.payment_method?.result=='111'||
  response?.data.payment_method?.result=='200' ){
    throw response
    }
}
const handleCodeError=(response)=>{
  if(response.data?.payment_method?.result=='101'){
    handleError('Declined by the bank',401)
    }
    if(response.data?.payment_method?.result=='102'){
    handleError('Referral B',401)
    }
    if(response.data?.payment_method?.result=='103'){
    handleError('Referral A - Card reported lost/stolen',401)
    }
    if(response.data?.payment_method?.result=='111'){
    handleError('Strong Customer Authentication Required',401)
    }
    if(response.data?.payment_method?.result=='200'){
    handleError('Communication Error',401)
    }
}

const handleErrorStatus=(err)=>{
    handleError(`${err?.response?.data?.detailed_error_description}`,403)
}

const chargeGlobalCreditCard=async(userId,paymentInfo)=>{
  try{
        const reference = `PAYMENT_TRANS_${userId}`;
        const payment_data= {
        account_name: "transaction_processing",
        channel: "CNP",
        capture_mode:"AUTO",
        type: "SALE",
        amount: paymentInfo?.amount,
        currency: "USD",
        reference: reference,
        country: "US",
        payment_method: {
            name: paymentInfo.billing_detail?.firstName,
            entry_mode: "ECOM",
            card: {
                number:paymentInfo?.card_detail?.cardNumber,
                expiry_month: paymentInfo?.card_detail?.expiry_month,
                expiry_year:paymentInfo?.card_detail?.expiry_year,
                cvv:paymentInfo?.card_detail?.cardCode,
                avs_address:paymentInfo.billing_detail?.address,
                avs_postal_code: paymentInfo.billing_detail?.zip
            }
        }
    }
    const accessToken = await getAccessToken();
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-GP-Version': '2021-03-22',
        'Authorization': `Bearer ${accessToken}`
      };
        const response = await axios.post(`${GLOBAL_PAY_URL}/transactions`,payment_data, { headers });
        
         if(response?.data){
          checkCodeError(response)
         }

       return {
        transId:response.data.id
       }
      }
       catch (error) {
        if(error?.data){
          handleCodeError(error)
        }
          handleErrorStatus(error)
      }
}

const chargeGlobalCreditCardFromInfo=async(userId,amount,customerPaymentProfileId)=>{
  try{
    const reference = `PAYMENT_TRANS_${userId}`;
    const payment_data= {
        account_name: "transaction_processing",
        channel: "CNP",
        capture_mode:"AUTO",
        type: "SALE",
        amount: amount,
        currency: "USD",
        reference: reference,
        country: "US",
        payment_method: {
            entry_mode: "ECOM",
            id:customerPaymentProfileId
        }
    }
    const accessToken = await getAccessToken();
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-GP-Version': '2021-03-22',
        'Authorization': `Bearer ${accessToken}`
      };
        const response = await axios.post(`${GLOBAL_PAY_URL}/transactions`,payment_data, { headers });
          if(response?.data){
            checkCodeError(response)
        }
        return {
        transId:response.data.id
       }
      }
    catch (error) {
      if(error?.data){
        handleCodeError(error)
      }
        handleErrorStatus(error)  }
}

const saveGlobalCreditCardInfo=async(userId,paymentInfo)=>{
  const reference = `PAYMENT_INFO_${userId}`;
  const payment_info= {
    account_name: "tokenization",
    reference:reference,
    card: {
        number:paymentInfo?.card_detail?.cardNumber,
        expiry_month: paymentInfo?.card_detail?.expiry_month,
        expiry_year:paymentInfo?.card_detail?.expiry_year,
        cvv:paymentInfo?.card_detail?.cardCode,

    }
}
const accessToken = await getAccessToken();
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-GP-Version': '2021-03-22',
    'Authorization': `Bearer ${accessToken}`
  };
 const response = await axios.post(`${GLOBAL_PAY_URL}/payment-methods`,payment_info, { headers });
 return{
    customerProfileId:reference,
    customerPaymentProfileId:response.data.id
 }
}

module.exports={
chargeGlobalCreditCard,
chargeGlobalCreditCardFromInfo,
saveGlobalCreditCardInfo,

}