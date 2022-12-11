const Sequalize = require("sequelize");
const sequelize = require("./index");

const Order = sequelize.define("order", {
  orderId: {
    type: Sequalize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequalize.INTEGER,
    allowNull: false,
  },
  productId: {
    type: Sequalize.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: Sequalize.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: Sequalize.FLOAT,
    allowNull: false,
  },
  orderDate: {
    type: Sequalize.DATE,
    allowNull: false,
  },
});

module.exports = Order;
