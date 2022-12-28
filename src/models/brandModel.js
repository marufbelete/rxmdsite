const Sequelize = require("sequelize");
const sequelize = require("./index");

const Brand = sequelize.define("brand", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  brand_name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Brand;
