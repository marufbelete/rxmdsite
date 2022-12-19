const Sequalize = require("sequelize");
const sequelize = require("./index");

const Payment = sequelize.define("payment", {
id: {
  type: Sequalize.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false
},
payment_method: {
  type: Sequalize.STRING,
  allowNull: false
}
});

module.exports = Payment;
