const Sequalize=require('sequelize');
const sequelize = require("./index");

const Product = sequelize.define("product", {
  id: {
    type: Sequalize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequalize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequalize.TEXT,
  },
  price: {
    type: Sequalize.FLOAT,
    allowNull: false,
  },
  imageUrl: {
    type: Sequalize.STRING,
    allowNull: false,
  },
  quantity: {
    type: Sequalize.INTEGER,
    defaultValue: 0,
  },
});
module.exports = Product;
