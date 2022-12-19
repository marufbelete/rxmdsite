const Sequalize = require("sequelize");
const sequelize = require("./index");

const Brand = sequelize.define("brand", {
id: {
  type: Sequalize.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false
},
brand_name: {
    type: Sequalize.STRING,
    allowNull: false
}
});

module.exports = Brand;
