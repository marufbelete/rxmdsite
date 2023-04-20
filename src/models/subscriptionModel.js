const Sequelize = require("sequelize");
const sequelize = require("./index");

const Subscription = sequelize.define("subscriptions", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userSubscriptionId: {
    type: Sequelize.STRING,
    defaultValue:false
  },
});

module.exports = Subscription;
