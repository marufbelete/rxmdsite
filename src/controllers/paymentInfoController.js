const PaymentInfo = require("../models/paymentInfoModel");

exports.getAllMyPaymentInfo = async (req, res, next) => {
  try {
    const payments = await PaymentInfo.findAll({where:{userId:req?.user?.sub}});
    console.log(payments)
    return res.json(payments);
  } catch (err) {
    console.log(err)
    next(err);
  }
};
