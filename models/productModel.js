const Sequalize = require("sequelize");
const sequelize = require("./index");

const Product = sequelize.define("product", {
id: {
  type: Sequalize.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false
  },
name: {
  type: Sequalize.STRING,
  allowNull: false,
},
price: {
  type: Sequalize.DECIMAL,
  allowNull: false
},
discount:{
  type: Sequalize.TINYINT,
  allowNull: false,
  defaultValue: 0
},
description: {
  type: Sequalize.STRING,
},
active: {
  type: Sequalize.BOOLEAN,
  allowNull: false,
  defaultValue: true
},
stock: {
  type: Sequalize.INTEGER,
  allowNull: false,
},
quantity: {
  type: Sequalize.INTEGER,
  defaultValue: 0,
  },
});

module.exports = Product;
