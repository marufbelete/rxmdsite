const Sequelize = require("sequelize");
const sequelize = require("./index");

const Category = sequelize.define("category", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING(45),
    allowNull: false
  }
});

module.exports = Category;
