const Sequalize = require("sequelize");
const sequelize = require("./index");

const Role = sequelize.define("role", {
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

module.exports = Role;
