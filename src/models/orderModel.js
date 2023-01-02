const Sequelize = require("sequelize");
const sequelize = require("./index");
const sequelizePaginate = require("sequelize-paginate");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  order_date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  delivery_date: {
    type: Sequelize.DATE,
  },
});

sequelizePaginate.paginate(Order);
module.exports = Order;
