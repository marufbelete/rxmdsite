const Order = require("../models/orderModel");
const Orderproduct = require("../models/orderproduct");
const User = require("../models/userModel");
const { isUserAdmin, isIntakeFormComplted } = require("../helper/user");
const Product = require("../models/productModel");
const sequelize = require("../models/index");
const { handleError } = require("../helper/handleError");
const {chargeCreditCard}=require('../functions/handlePayment');

exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    console.log("in making order")
    const {payment_detail, product_ordered } = req.body;
    if (!(await isIntakeFormComplted(req))) {
      handleError("Please complete the registration form", 400);
    }
    const order = await Order.create(
      {
        userId: req?.user?.sub,
      },
      { transaction: t }
    );
    console.log("done here")
    console.log(order)
    let total_amount=0
    for await (const prod of product_ordered) {
      const product = await Product.findByPk(prod.id);
      total_amount=total_amount+(Number(prod.quantity)*Number(product.price))
      await Orderproduct.create(
        {
          productId: prod.id,
          product_name: product.product_name,
          discount: product.discount,
          description: product.description,
          price: product?.price,
          tax: product?.tax,
          quantity:prod.quantity,
          // image_url: product.image_url,
          orderId: order.id,
        },
        { transaction: t }
      );
    }
    console.log(total_amount)
    const payment_info={
     amount:total_amount,
     card_detail:{
     cardNumber:payment_detail?.cardNumber,
     expirtationDate:payment_detail?.expirtationDate?.
      replace('/', ''),
     cardCode:payment_detail?.cardCode,
     firstName:payment_detail?.ownerFirstName,
     lastName:payment_detail?.ownerLastName
     },
     billing_detail:{
     firstName:payment_detail?.billingFirstName,
     lastName:payment_detail?.billingLastName,
     email:payment_detail?.email,
     address:payment_detail?.address,
     city:payment_detail?.city,
     state:payment_detail?.state,
     zip:payment_detail?.zip,
     country:'USA'
     }
  }
  console.log(payment_info)
    const payment_response=await chargeCreditCard(payment_info)
    console.log(payment_response)
    order.transId=payment_response.transId
    // order.total_amount_paid=
    await order.save({ transaction: t })
    await t.commit();
    return res.json(order);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const { page, paginate } = req.query;
    if (isUserAdmin(req)) {
      const options = {
        attributes: ["id", "order_date", "delivery_date"],
        include: [
          {
            model: User,
            attributes: ["id", "first_name", "last_name", "email", "address"],
          },
          { model: Shipping, attributes: ["id", "name"] },
          { model: Payment, attributes: ["id", "payment_method"] },
          {
            model: Orderproduct,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        page: Number(page) || 1,
        paginate: Number(paginate) || 25,
        order: [["order_date", "DESC"]],
      };
      const orders = await Order.paginate(options);
      return res.json(orders);
    }

    const options = {
      where: { userId: req?.user?.sub },
      attributes: ["id", "order_date", "delivery_date"],
      include: [
        { model: User },
        { model: Shipping },
        { model: Payment },
        { model: Orderproduct },
      ],
      page: Number(page) || 1,
      paginate: Number(paginate) || 25,
      order: [["order_date", "DESC"]],
    };
    const orders = await Order.paginate(options);
    return res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isUserAdmin(req)) {
      const order = await Order.findByPk(id, {
        include: ["user", "shipping", "payment", "order_products"],
      });
      return res.json(order);
    }
    const order = await Order.findByPk(id, {
      where: { userId: req?.user?.sub },
      include: ["user", "shipping", "payment", "order_products"],
    });
    return res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.getMyOrder = async (req, res, next) => {
  try {
    const order = await Order.findAll({
      where: { userId: req?.user?.sub },
      include: ["user", "shipping", "payment", "order_products"],
    });
    return res.json(order);
  } catch (err) {
    next(err);
  }
};
exports.editOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isUserAdmin(req)) {
      const updated_order = await Order.update(
        { ...req.body },
        { where: { id: id } }
      );
      return res.json(updated_order);
    }
    const updated_order = await Order.update(
      { ...req.body },
      { where: { id: id, userId: req?.user?.sub } }
    );
    return res.json(updated_order);
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isUserAdmin(req)) {
      await Order.destroy({ where: { id } });
      return res.json({
        success: true,
        message: "Order deleted",
      });
    }
    await Order.destroy({ where: { id, userId: req?.user?.sub } });
    return res.json({
      success: true,
      message: "Order deleted",
    });
  } catch (err) {
    next(err);
  }
};
