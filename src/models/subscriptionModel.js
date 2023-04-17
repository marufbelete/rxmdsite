const Sequelize = require("sequelize");
const sequelize = require("./index");

const Subscription = sequelize.define("subscriptions", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
 userProfileId: {
    type: Sequelize.STRING,
    defaultValue:false
  },
 userProfilePaymentId: {
    type: Sequelize.STRING,
    defaultValue:false
  },
 userSubscriptionId: {
    type: Sequelize.STRING,
    defaultValue:false
  },
});

module.exports = Subscription;
