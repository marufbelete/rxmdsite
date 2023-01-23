// const Payment = require("../models/paymentModel");
// const { validationResult } = require("express-validator");

// exports.addPayment = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ message: errors.array()[0].msg });
//     }
//     const add_payment = new Payment({ ...req.body });
//     const new_payment = await add_payment.save();
//     return res.json(new_payment);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getPayment = async (req, res, next) => {
//   try {
//     const payments = await Payment.findAll();
//     return res.json(payments);
//   } catch (err) {
//     next(err);
//   }
// };
// exports.getPaymentById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const payment = await Payment.findByPk(id);
//     return res.json(payment);
//   } catch (err) {
//     next(err);
//   }
// };
// exports.editPayment = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const updated_payment = await Payment.update(
//       { ...req.body },
//       { where: { id: id } }
//     );
//     return res.json(updated_payment);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.deletePayment = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     await Payment.destroy({ where: { id } });
//     return res.json({
//       success: true,
//       message: "Payment method deleted",
//     });
//   } catch (err) {
//     next(err);
//   }
// };
