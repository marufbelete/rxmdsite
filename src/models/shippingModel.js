const Sequelize = require("sequelize");
const sequelize = require("./index");

const Shipping = sequelize.define("shipping", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

module.exports = Shipping;
