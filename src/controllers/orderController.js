const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Shipping = require("../models/shippingModel");
const Orderproduct = require("../models/orderproduct");
const User = require("../models/userModel");
const { isUserAdmin, isIntakeFormComplted } = require("../helper/user");
const Product = require("../models/productModel");
const sequelize = require("../models/index");
const { handleError } = require("../helper/handleError");

exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { products, ...other } = req.body;
    const order = await Order.create(
      {
        userId: req?.user?.sub,
        ...other,
      },
      { transaction: t }
    );
    if (!(await isIntakeFormComplted(req))) {
      handleError("Please complete the registration form", 400);
    }
    for await (const prod of products) {
      const product = await Product.findByPk(prod.id);
      await Orderproduct.create(
        {
          // quantity: prod.quantity,
          productId: prod.id,
          product_name: product.product_name,
          discount: product.discount,
          description: product.description,
          price: product.price,
          tax: product.tax,
          image_url: product.image_url,
          orderId: order.id,
        },
        { transaction: t }
      );
    }
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
