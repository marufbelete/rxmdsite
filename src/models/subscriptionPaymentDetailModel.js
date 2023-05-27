const Sequelize = require("sequelize");
const sequelize = require("./index");

const SubscriptionPayment = sequelize.define("subscription_payment", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  transId:{
    type: Sequelize.STRING,
    defaultValue:3
  },
 
});

module.exports = SubscriptionPayment;
