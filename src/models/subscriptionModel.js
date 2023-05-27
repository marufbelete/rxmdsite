const Sequelize = require("sequelize");
const sequelize = require("./index");

const Subscription = sequelize.define("subscription", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  period:{
    type: Sequelize.INTEGER,
    defaultValue:3
  },
  status:{
    type: Sequelize.ENUM("active", "canceled", "ended", "start"),
    defaultValue: "start"
  },
  paymentAmount:{
    type: Sequelize.DECIMAL
  },
  currentPeriod:{
    type: Sequelize.INTEGER,
    defaultValue:1
  },
});

module.exports = Subscription;
