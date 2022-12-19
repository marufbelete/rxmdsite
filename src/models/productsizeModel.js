const Sequalize = require("sequelize");
const sequelize = require("./index");

const ProductSize = sequelize.define("product_size", {
id: {
  type: Sequalize.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false
},
size: {
    type: Sequalize.INTEGER,
    allowNull: false
},

});

module.exports = ProductSize;
