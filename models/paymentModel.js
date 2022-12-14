const Sequalize = require("sequelize");
const sequelize = require("./index");

const Payment = sequelize.define("payment", {
id: {
  type: Sequalize.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false
},
name: {
  type: Sequalize.STRING(45),
  allowNull: false
}
});

module.exports = Payment;
