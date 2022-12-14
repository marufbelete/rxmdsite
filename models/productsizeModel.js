const Sequalize = require("sequelize");
const sequelize = require("./index");

const ProductSize = sequelize.define("product_size", {
id: {
  type: Sequalize.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false
},
size_id: {
    type: Sequalize.INTEGER,
    allowNull: false
},
isActive: {
    type: Sequalize.BOOLEAN,
    allowNull: false
},
});

module.exports = ProductSize;
