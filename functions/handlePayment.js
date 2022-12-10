const jwt = require("jsonwebtoken");
const authorizeNet = require("authorize-net");


const Order = require("../models/order");

const handlePayment = async (req, res) => {
    try {
      // retrieve payment information from the request body
      const { amount, cardNumber, expirationDate, cvv } = req.body;

      // create a new transaction using authorize.net API
      const result = await createTransaction(amount, cardNumber, expirationDate, cvv);

      // check if the transaction was successful
      if (result.success) {
        // return a success response to the client
        res.status(200).send({
          message: "Payment successful"
        });
      } else {
        // return an error response to the client
        res.status(400).send({
          message: "Payment failed"
        });
      }
    } catch (error) {
      // return an error response to the client
      res.status(500).send({
        message: "An error occurred while processing the payment"
      });
    }
  };
