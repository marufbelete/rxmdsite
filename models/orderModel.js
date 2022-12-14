const Sequalize = require("sequelize");
const sequelize = require("./index");

const Order = sequelize.define("order", {
  id: {
    type: Sequalize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  quantity: {
    type: Sequalize.INTEGER,
    allowNull: false,
  },
  tax: {
    type: Sequalize.DECIMAL,
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
