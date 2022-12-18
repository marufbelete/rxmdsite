const Sequelize = require("sequelize");
const sequelize = require("./index");

const Role = sequelize.define("role", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  role: {
    type: Sequelize.STRING(45),
    allowNull: false
  }
});

module.exports = Role;
