const axios = require('axios');
const GLOBAL_PAY_URL = 'https://apis.sandbox.globalpay.com/ucp';
const crypto = require('crypto');

function sha512(input) {
  const hash = crypto.createHash('sha512');
  hash.update(input);
  return hash.digest('hex');
}

const getAccessToken=async()=>{
//    api>> https://{{url}}/ucp/accesstoken
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

const chargeGlobalCreditCard=async(userId,paymentInfo)=>{
        // api>>https://{{url}}/ucp/transactions
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
       return {
        transId:response.data.id
       }
}

const chargeGlobalCreditCardFromInfo=async(userId,amount,customerPaymentProfileId)=>{
    // api>>https://{{url}}/ucp/transactions
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
       return {
        transId:response.data.id
       }

}

const saveGlobalCreditCardInfo=async(userId,paymentInfo)=>{
//   api>> https://{{url}}/ucp/payment-methods
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
// {
//     "error_code": "NOT_AUTHENTICATED",
//     "detailed_error_code": "40002",
//     "detailed_error_description": "Access token expired"
// }
// const getGlobalCreditCardInfo=async(paymentInfo)=>{
//     api>>https://{{url}}/ucp/payment-methods?reference=test_belete
//     return{
//         "total_record_count": 1,
//         "current_page_size": 1,
//         "merchant_id": "MER_7e3e2c7df34f42819b3edee31022ee3f",
//         "merchant_name": "Sandbox_merchant_3",
//         "account_id": "TKA_b3a46f0f351f43cfad20acf5c32fea50",
//         "account_name": "tokenization",
//         "filter": {
//             "reference": "TEST_BELETE",
//             "from_time_created": "2023-07-29T00:00:00.000Z",
//             "to_time_created": "2023-08-28T23:59:59.999Z"
//         },
//         "paging": {
//             "page_size": 5,
//             "page": 1,
//             "order": "ASC",
//             "order_by": "TIME_CREATED"
//         },
//         "payment_methods": [
//             {
//                 "id": "PMT_67ebf23d-4e1c-44af-8202-4af3addb9e4e",
//                 "time_created": "2023-08-28T04:57:58.000Z",
//                 "status": "ACTIVE",
//                 "reference": "test_belete",
//                 "card": {
//                     "number_last4": "xxxxxxxxxxxx4242",
//                     "brand": "VISA",
//                     "expiry_month": "12",
//                     "expiry_year": "23"
//                 }
//             }
//         ],
//         "action": {
//             "id": "ACT_KYerPWt5phuzaLiR0mGqWc3X09SCpH",
//             "type": "PAYMENT_METHOD_LIST",
//             "time_created": "2023-08-28T07:04:37.515Z",
//             "result_code": "SUCCESS",
//             "app_id": "tucamTiP91IYumIqsSFNBkVADKBGYa1o",
//             "app_name": "maruf_test"
//         }
//     }

//     const accessToken = await getAccessToken();
// const headers = {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     'X-GP-Version': '2021-03-22',
//     'Authorization': `Bearer ${accessToken}`
//   };
//  const response = await axios.post(`${GLOBAL_PAY_URL}/payment-methods`,payment_info, { headers });

// }



// {
//     "token": "ngM85zukSLTT2AS3SbzxvjA0Uvhf",
//     "type": "Bearer",
//     "scope": {
//         "merchant_id": "MER_7e3e2c7df34f42819b3edee31022ee3f",
//         "merchant_name": "Sandbox_merchant_3",
//         "accounts": [
//             {
//                 "id": "TRA_c9967ad7d8ec4b46b6dd44a61cde9a91",
//                 "name": "transaction_processing",
//                 "permissions": [
//                     "ACC_GET_List",
//                     "ACC_GET_Single",
//                     "ACT_GET_List",
//                     "ACT_GET_Single",
//                     "ACT_POST_Auto_Action",
//                     "ACT_POST_Multiple",
//                     "AUT_POST_Check_Availability",
//                     "AUT_POST_Initiate",
//                     "AUT_POST_Results",
//                     "CCS_POST_DCC",
//                     "GET_Single",
//                     "LNK_GET_List",
//                     "LNK_GET_Single",
//                     "LNK_PATCH_Edit",
//                     "LNK_POST_Create",
//                     "TRN_GET_List",
//                     "TRN_GET_Single",
//                     "TRN_POST_Adjust",
//                     "TRN_POST_Authorize",
//                     "TRN_POST_Capture",
//                     "TRN_POST_Capture_Multiple",
//                     "TRN_POST_Confirm",
//                     "TRN_POST_Initiate",
//                     "TRN_POST_Reauthorize",
//                     "TRN_POST_Refund",
//                     "TRN_POST_Refund_Standalone",
//                     "TRN_POST_Reverse",
//                     "VER_POST_Verify"
//                 ]
//             },
//             {
//                 "id": "TRA_2f92c641eb7f43449541a038baea9154",
//                 "name": "dcc_rate",
//                 "permissions": [
//                     "ACC_GET_List",
//                     "ACC_GET_Single",
//                     "ACT_GET_List",
//                     "ACT_GET_Single",
//                     "ACT_POST_Multiple",
//                     "AUT_POST_Check_Availability",
//                     "AUT_POST_Initiate",
//                     "AUT_POST_Results",
//                     "CCS_GET_Bin_Ranges",
//                     "CCS_POST_DCC",
//                     "GET_Single",
//                     "TRN_GET_List",
//                     "TRN_GET_Single",
//                     "TRN_POST_Adjust",
//                     "TRN_POST_Authorize",
//                     "TRN_POST_Confirm",
//                     "TRN_POST_Initiate",
//                     "TRN_POST_Reauthorize",
//                     "TRN_POST_Refund",
//                     "TRN_POST_Refund_Standalone",
//                     "TRN_POST_Reverse",
//                     "VER_POST_Verify"
//                 ]
//             },
//             {
//                 "id": "TRA_e30e4de8bb3e44dda8df87c74868587c",
//                 "name": "dcc_p",
//                 "permissions": [
//                     "ACC_GET_List",
//                     "ACC_GET_Single",
//                     "ACT_GET_List",
//                     "ACT_GET_Single",
//                     "ACT_POST_Multiple",
//                     "AUT_POST_Check_Availability",
//                     "AUT_POST_Initiate",
//                     "AUT_POST_Results",
//                     "CCS_POST_DCC",
//                     "GET_Single",
//                     "TRN_GET_List",
//                     "TRN_GET_Single",
//                     "TRN_POST_Adjust",
//                     "TRN_POST_Authorize",
//                     "TRN_POST_Confirm",
//                     "TRN_POST_Initiate",
//                     "TRN_POST_Reauthorize",
//                     "TRN_POST_Refund",
//                     "TRN_POST_Refund_Standalone",
//                     "TRN_POST_Reverse",
//                     "VER_POST_Verify"
//                 ]
//             },
//             {
//                 "id": "TRA_e50028826456453db3d127145655de12",
//                 "name": "paylink",
//                 "permissions": [
//                     "ACT_POST_Auto_Action",
//                     "LNK_GET_List",
//                     "LNK_GET_Single",
//                     "LNK_PATCH_Edit",
//                     "LNK_POST_Create"
//                 ]
//             },
//             {
//                 "id": "TRA_baa3d4f50fda4d7c9341815c79576f27",
//                 "name": "dcc",
//                 "permissions": [
//                     "ACC_GET_List",
//                     "ACC_GET_Single",
//                     "ACT_GET_List",
//                     "ACT_GET_Single",
//                     "ACT_POST_Auto_Action",
//                     "ACT_POST_Multiple",
//                     "AUT_POST_Check_Availability",
//                     "AUT_POST_Initiate",
//                     "AUT_POST_Results",
//                     "CCS_GET_Bin_Ranges",
//                     "CCS_POST_DCC",
//                     "GET_Single",
//                     "LNK_GET_List",
//                     "LNK_GET_Single",
//                     "LNK_PATCH_Edit",
//                     "LNK_POST_Create",
//                     "TRN_GET_List",
//                     "TRN_GET_Single",
//                     "TRN_POST_Adjust",
//                     "TRN_POST_Authorize",
//                     "TRN_POST_Confirm",
//                     "TRN_POST_Initiate",
//                     "TRN_POST_Reauthorize",
//                     "TRN_POST_Refund",
//                     "TRN_POST_Refund_Standalone",
//                     "TRN_POST_Reverse",
//                     "VER_POST_Verify"
//                 ]
//             },
//             {
//                 "id": "TKA_b3a46f0f351f43cfad20acf5c32fea50",
//                 "name": "tokenization",
//                 "permissions": [
//                     "ACC_GET_List",
//                     "ACC_GET_Single",
//                     "ACT_GET_List",
//                     "ACT_GET_Single",
//                     "ACT_POST_Auto_Action",
//                     "ACT_POST_Multiple",
//                     "GET_Single",
//                     "PMT_GET_List",
//                     "PMT_GET_Single",
//                     "PMT_PATCH_Edit",
//                     "PMT_POST_Create",
//                     "PMT_POST_Create_Single",
//                     "PMT_POST_Detokenize",
//                     "PMT_POST_Search"
//                 ]
//             },
//             {
//                 "id": "DIA_d4f75884b1e54ae4a5e904155f629f26",
//                 "name": "dispute_management",
//                 "permissions": [
//                     "ACC_GET_List",
//                     "ACC_GET_Single",
//                     "ACT_GET_List",
//                     "ACT_GET_Single",
//                     "ACT_POST_Multiple",
//                     "GET_Single",
//                     "DIS_GET_Lists",
//                     "DIS_GET_Single",
//                     "DIS_POST_Accept",
//                     "DIS_POST_Challenge"
//                 ]
//             },
//             {
//                 "id": "DAA_fabf29a777724d83998f6cc4747b7d9a",
//                 "name": "settlement_reporting",
//                 "permissions": [
//                     "ACC_GET_List",
//                     "ACC_GET_Single",
//                     "ACT_POST_Multiple",
//                     "GET_Single",
//                     "TRN_GET_List_Funded",
//                     "TRN_GET_Single_Funded",
//                     "DIS_GET_List_Funded",
//                     "DIS_GET_Single_Funded",
//                     "DEP_GET_List",
//                     "DEP_GET_Single"
//                 ]
//             }
//         ]
//     },
//     "app_id": "tucamTiP91IYumIqsSFNBkVADKBGYa1o",
//     "app_name": "maruf_test",
//     "time_created": "2023-08-28T04:32:48.717Z",
//     "seconds_to_expire": 86399,
//     "email": "marufbelete9@gmail.com"
// }





// {
//     "total_record_count": 1,
//     "current_page_size": 1,
//     "merchant_id": "MER_7e3e2c7df34f42819b3edee31022ee3f",
//     "merchant_name": "Sandbox_merchant_3",
//     "account_id": "TKA_b3a46f0f351f43cfad20acf5c32fea50",
//     "account_name": "tokenization",
//     "filter": {
//         "reference": "TEST_BELETE",
//         "from_time_created": "2023-07-29T00:00:00.000Z",
//         "to_time_created": "2023-08-28T23:59:59.999Z"
//     },
//     "paging": {
//         "page_size": 5,
//         "page": 1,
//         "order": "ASC",
//         "order_by": "TIME_CREATED"
//     },
//     "payment_methods": [
//         {
//             "id": "PMT_67ebf23d-4e1c-44af-8202-4af3addb9e4e",
//             "time_created": "2023-08-28T04:57:58.000Z",
//             "status": "ACTIVE",
//             "reference": "test_belete",
//             "card": {
//                 "number_last4": "xxxxxxxxxxxx4242",
//                 "brand": "VISA",
//                 "expiry_month": "12",
//                 "expiry_year": "23"
//             }
//         }
//     ],
//     "action": {
//         "id": "ACT_RlB4XzerE3sFu4SikhCI5WADKYKOB6",
//         "type": "PAYMENT_METHOD_LIST",
//         "time_created": "2023-08-28T04:58:26.513Z",
//         "result_code": "SUCCESS",
//         "app_id": "tucamTiP91IYumIqsSFNBkVADKBGYa1o",
//         "app_name": "maruf_test"
//     }
// }



// {
//     "id": "TRN_9sOGNiZkIM147Q5Tuntn3AHBYa8zDn_testonetwo",
//     "time_created": "2023-08-28T06:51:49.199Z",
//     "type": "SALE",
//     "status": "CAPTURED",
//     "channel": "CNP",
//     "capture_mode": "AUTO",
//     "amount": "100",
//     "currency": "USD",
//     "country": "US",
//     "merchant_id": "MER_7e3e2c7df34f42819b3edee31022ee3f",
//     "merchant_name": "Sandbox_merchant_3",
//     "account_id": "TRA_c9967ad7d8ec4b46b6dd44a61cde9a91",
//     "account_name": "transaction_processing",
//     "reference": "testonetwo",
//     "payment_method": {
//         "result": "00",
//         "message": "[ test system ] Authorised",
//         "entry_mode": "ECOM",
//         "card": {
//             "funding": "CREDIT",
//             "brand": "VISA",
//             "masked_number_last4": "XXXXXXXXXXXX4242",
//             "authcode": "12345",
//             "brand_reference": "JHM2LOHABvlV3EwP",
//             "brand_time_created": "",
//             "tag_response": "",
//             "cvv_result": "MATCHED",
//             "avs_address_result": "MATCHED",
//             "avs_postal_code_result": "MATCHED",
//             "avs_action": "",
//             "provider": {
//                 "result": "00",
//                 "cvv_result": "M",
//                 "avs_address_result": "M",
//                 "avs_postal_code_result": "M"
//             }
//         }
//     },
//     "risk_assessment": [
//         {
//             "mode": "ACTIVE",
//             "result": "ACCEPTED",
//             "rules": [
//                 {
//                     "reference": "0c93a6c9-7649-4822-b5ea-1efa356337fd",
//                     "description": "Cardholder Name Rule",
//                     "mode": "ACTIVE",
//                     "result": "ACCEPTED"
//                 },
//                 {
//                     "reference": "a539d51a-abc1-4fff-a38e-b34e00ad0cc3",
//                     "description": "CardNumber block",
//                     "mode": "ACTIVE",
//                     "result": "ACCEPTED"
//                 },
//                 {
//                     "reference": "d023a19e-6985-4fda-bb9b-5d4e0dedbb1e",
//                     "description": "Amount test",
//                     "mode": "ACTIVE",
//                     "result": "ACCEPTED"
//                 }
//             ]
//         }
//     ],
//     "batch_id": "BAT_1297480",
//     "action": {
//         "id": "ACT_9sOGNiZkIM147Q5Tuntn3AHBYa8zDn",
//         "type": "AUTHORIZE",
//         "time_created": "2023-08-28T06:51:49.199Z",
//         "result_code": "SUCCESS",
//         "app_id": "tucamTiP91IYumIqsSFNBkVADKBGYa1o",
//         "app_name": "maruf_test"
//     }
// }