const Order = require("../models/orderModel");
const Orderproduct = require("../models/orderproduct");
const User = require("../models/userModel");
const { isUserAdmin, isIntakeFormComplted } = require("../helper/user");
const Product = require("../models/productModel");
const sequelize = require("../models/index");
const { handleError } = require("../helper/handleError");
const { chargeCreditCard } = require('../functions/handlePayment');

//Unused Shop stuff - save for later
// const Payment = require("../models/paymentModel");
// const Shipping = require("../models/shippingModel");

exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {payment_detail, product_ordered } = req.body;
    const {cardCode,expirtationDate,cardNumber,billingLastName,
      email,billingFirstName,address,city,state,zip}=payment_detail
      if(!cardCode||!expirtationDate||!cardNumber||!billingLastName||!
        email||!billingFirstName||!address||!city||!state||!zip){
          handleError("Please fill all field", 400);
        }
    if (!(await isIntakeFormComplted(req))) {
      handleError("Please complete the registration form", 400);
    }
    const order = await Order.create(
      {
        userId: req?.user?.sub,
      },
      { transaction: t }
    );
    let total_amount=0
    for await (const prod of product_ordered) {
      const product = await Product.findByPk(prod?.productId);
      total_amount=total_amount+(Number(prod?.quantity||1)*Number(product?.price))
      await Orderproduct.create(
        {
          productId: prod?.productId,
          product_name: product?.product_name,
          discount: product?.discount,
          description: product?.description,
          price: product?.price,
          tax: product?.tax,
          quantity:prod?.quantity,
          // image_url: product.image_url,
          orderId: order?.id,
        },
        { transaction: t }
      );
    }
    //update the user address info
    User.update({
     address:address,
     city:city,
     state:state,
     zip_code:zip,
     country:'USA'
    },{where:{id:req?.user?.sub}})

    const payment_info={
     amount:total_amount,
     card_detail:{
     cardNumber:cardNumber,
     expirtationDate:expirtationDate?.
      replace('/', ''),
     cardCode:cardCode,
    //  firstName:payment_detail?.ownerFirstName,
    //  lastName:payment_detail?.ownerLastName
     },
     billing_detail:{
     firstName:billingFirstName,
     lastName:billingLastName,
     email:email,
     address:address,
     city:city,
     state:state,
     zip:zip,
     country:'USA'
     }
  }
    const payment_response=await chargeCreditCard(payment_info)
    order.transId=payment_response.transId
    order.total_paid_amount=total_amount.toFixed(2)
    await order.save({ transaction: t })
    await t.commit();
    return res.json(order);
  } catch (err) {
    await t.rollback();
    console.log("error n")
    console.log(err)
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    // const { page, paginate } = req.query;
    if (isUserAdmin(req)) {
      const options = {
        attributes: ["id","total_paid_amount","order_date","transId"],
        include: [
          {
            model: User,
            attributes: ["id", "first_name", "last_name", "email", "address","city","state","country"],
          },
          {
            model: Orderproduct,
            attributes: ["id", "product_name", "quantity", "price"],
          },
        ],
        // page: Number(page) || 1,
        // paginate: Number(paginate) || 25,
        order: [["order_date", "DESC"]],
      };
      const orders = await Order.findAll(options);
      return res.json(orders);
    }

    const options = {
      where: { userId: req?.user?.sub },
      attributes: ["id","total_paid_amount","order_date"],
      include: [
        { model: User, 
          attributes: ["id", "first_name", "last_name", "email", "address"],
        },
        { model: Orderproduct,
          attributes: ["id", "product_name", "quantity", "price"],
        },
      ],
      // page: Number(page) || 1,
      // paginate: Number(paginate) || 25,
      order: [["order_date", "DESC"]],
    };
    const orders = await Order.findAll(options);
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
        include: ["user","order_products"],
      });
      return res.json(order);
    }
    const order = await Order.findByPk(id, {
      where: { userId: req?.user?.sub },
      include: ["user","order_products"],
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
      include: ["user", "order_products"],
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
