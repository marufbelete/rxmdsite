const Orderproduct = require("../models/orderproduct");
const { isUserAdmin } = require("../helper/user");
exports.getOrderProduct = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { page, paginate } = req.query;
    if (isUserAdmin(req)) {
      const options = {
        where: { orderId },
        page: Number(page) || 1,
        paginate: Number(paginate) || 25,
      };
      const products = await Orderproduct.paginate(options);
      return res.json(products);
    }
    const options = {
      where: { orderId, "$Order.userId$": req?.user?.sub },
      page: Number(page) || 1,
      paginate: Number(paginate) || 25,
    };
    const products = await Orderproduct.paginate(options);
    return res.json(products);
  } catch (err) {
    next(err);
  }
};
exports.getOrderproductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isUserAdmin(req)) {
      const order_product = await Orderproduct.findOne({
        where: { id },
        include: ["order"],
      });
      return res.json(order_product);
    }
    const order_product = await Orderproduct.findOne({
      where: { id },
      where: { "$Order.userId$": req?.user?.sub },
      include: ["order"],
    });
    return res.json(order_product);
  } catch (err) {
    next(err);
  }
};

exports.editOrderproduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isUserAdmin(req)) {
      const updated_order_product = await Orderproduct.update(
        { ...req.body },
        { where: { id: id } }
      );
      return res.json(updated_order_product);
    }
    const change = {};
    if (req.body.quantity) {
      change.quantity = req.body.quantity;
    }
    const updated_order_product = await Orderproduct.update(
      { ...change },
      { where: { id: id, "$Order.userId$": req?.user?.sub } }
    );
    return res.json(updated_order_product);
  } catch (err) {
    next(err);
  }
};

exports.deleteOrderproduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isUserAdmin(req)) {
      await Orderproduct.destroy({ where: { id } });
      return res.json({
        success: true,
        message: "item deleted",
      });
    }
    await Orderproduct.destroy({
      where: {
        id,
        "$Order.userId$": req?.user?.sub,
      },
    });
    return res.json({
      success: true,
      message: "item deleted",
    });
  } catch (err) {
    next(err);
  }
};
