const Sequelize = require("sequelize");
const sequelize = require("./index");

const Payment = sequelize.define("payment", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  payment_method: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Payment;
