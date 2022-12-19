const Sequalize = require("sequelize");
const sequelize = require("./index");
const sequelizePaginate = require('sequelize-paginate')

const Order = sequelize.define("order", {
  id: {
    type: Sequalize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  order_date: {
    type: Sequalize.DATE,
    defaultValue:Sequalize.NOW,
    allowNull: false,
  },
  delivery_date: {
    type: Sequalize.DATE,
  },
});

sequelizePaginate.paginate(Order)
module.exports = Order;
