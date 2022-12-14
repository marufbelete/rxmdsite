const Sequalize = require("sequelize");
const sequelize = require("./index");

const Brand = sequelize.define("brand", {
id: {
  type: Sequalize.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false
},
name: {
    type: Sequalize.STRING(45),
    allowNull: false
}
});

module.exports = Brand;
