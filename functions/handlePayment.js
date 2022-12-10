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
