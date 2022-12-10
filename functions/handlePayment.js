<<<<<<< HEAD
// const jwt = require("jsonwebtoken");
// const authorizeNet = require("authorize-net");
// const { createTransaction, getTransactionDetails } = require('authorize-net');
// const apiLoginId = process.env;
// const transactionKey = 'YOUR_TRANSACTION_KEY';
// require('dotenv').config();

// const Order = require("../models/order");

// const handlePayment = async (req, res) => {
//   try {
//     const { orderId, paymentToken } = req.body;

//     // verify JWT token
//     const decodedToken = jwt.verify(
//       req.headers.authorization,
//       process.env.SECRET_KEY
//     );

//     // retrieve order from database using orderId
//     const order = await Order.findByPk(orderId);

//     // create payment object for authorize.net
//     const payment = {
//       amount: order.total,
//       paymentToken: paymentToken,
//     };

//     // make API call to authorize.net to charge credit card
//     const response = await authorizeNet.chargeCreditCard(payment);

//     // if payment is successful, save order to database
//     if (response.success) {
//       order.status = "paid";
//       await order.save();
//     }

//     res.json({
//       success: response.success,
//       message: response.message,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// module.exports = handlePayment;


// // const { createTransaction, getTransactionDetails } = require('authorize-net');

// // const apiLoginId = 'YOUR_API_LOGIN_ID';
// // const transactionKey = 'YOUR_TRANSACTION_KEY';

// // const transaction = createTransaction(apiLoginId, transactionKey, {
// //   transaction: {
// //     amount: '10.00', // amount to charge the customer
// //     payment: {
// //       creditCard: {
// //         cardNumber: '4111111111111111', // customer's credit card number
// //         expirationDate: '2022-08' // customer's credit card expiration date
// //       }
// //     }
// //   }
// // });

// // transaction.on('response', response => {
// //   if (response.transactionResponse.responseCode === 1) {
// //     // transaction was successful
// //     console.log('Transaction successful!');
// //   } else {
// //     // transaction failed
// //     console.log('Transaction failed: ' + response.transactionResponse.errors[0].errorText);
// //   }
// // });

// // transaction.on('error', error => {
// //   // an error occurred
// //   console.log('Transaction failed: ' + error.message);
// // });

// // transaction.submit();






// // const express = require('express');
// // const jwt = require('jsonwebtoken');
// // const { createTransaction, getTransactionDetails } = require('authorize-net');

// // const apiLoginId = 'YOUR_API_LOGIN_ID';
// // const transactionKey = 'YOUR_TRANSACTION_KEY';

// // const app = express();

// // app.post('/charge-credit-card', (req, res) => {
// //   const token = req.headers.authorization.split(' ')[1];
// //   const decodedToken = jwt.verify(token, 'SECRET_KEY');
// //   const userId = decodedToken.userId;

// //   // get the credit card information from the request body
// //   const { cardNumber, expirationDate } = req.body;

// //   // create the transaction object
// //   const transaction = createTransaction(apiLoginId, transactionKey, {
// //     transaction: {
// //       amount: '10.00', // amount to charge the customer
// //       payment: {
// //         creditCard: {
// //           cardNumber,
// //           expirationDate
// //         }
// //       }
// //     }
// //   });

// //   transaction.on('response', response => {
// //     if (response.transactionResponse.responseCode === 1) {
// //       // transaction was successful
// //       console.log('Transaction successful!');

// //       // use Sequelize to save the transaction details to the database
// //       const transactionId = response.transactionResponse.transId;
// //       const amount = response.transactionResponse.amount;
// //       const status = 'SUCCESS';

// //       User.findByPk(userId).then(user => {
// //         return user.createTransaction({
// //           transactionId,
// //           amount,
// //           status
// //         });
// //       }).then(() => {
// //         res.status(200).json({
// //           message: 'Transaction successful!'
// //         });
// //       }).catch(error => {
// //         res.status(500).json({
// //           error
// //         });
// //       });
// //     } else {
// //       // transaction failed
// //       console.log('Transaction failed: ' + response.transactionResponse.errors[0].errorText);
// //       res.status(500).json({
// //         error: response.transactionResponse
=======
const jwt = require("jsonwebtoken");
const authorizeNet = require("authorize-net");


const Order = require("../models/order");

const handlePayment = async (req, res) => {
  try {
    const { orderId, paymentToken } = req.body;

    // verify JWT token
    const decodedToken = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    // retrieve order from database using orderId
    const order = await Order.findByPk(orderId);

    // create payment object for authorize.net
    const payment = {
      amount: order.total,
      paymentToken: paymentToken,
    };

    // make API call to authorize.net to charge credit card
    const response = await authorizeNet.chargeCreditCard(payment);

    // if payment is successful, save order to database
    if (response.success) {
      order.status = "paid";
      await order.save();
    }

    res.json({
      success: response.success,
      message: response.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = handlePayment;
>>>>>>> 039fc72 (updated functions for handlepayment - still needs a lot of work (#2))
