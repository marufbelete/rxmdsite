const Sequelize = require("sequelize");
const sequelize = require("./index");

const Subscription = sequelize.define("subscriptions", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

module.exports = Subscription;
