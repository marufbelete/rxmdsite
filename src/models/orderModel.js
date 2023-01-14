const Sequelize = require("sequelize");
const sequelize = require("./index");
// const sequelizePaginate = require("sequelize-paginate");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  total_paid_amount:{
    type: Sequelize.STRING
  },
  transId:{
    type: Sequelize.STRING
  },
  order_date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  delivery_date: {
    type: Sequelize.DATE,
  },
});

// sequelizePaginate.paginate(Order);
module.exports = Order;
