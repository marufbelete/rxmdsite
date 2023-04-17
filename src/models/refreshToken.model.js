const Sequelize = require("sequelize");
const sequelize = require("./index");

const RefreshToken = sequelize.define("refresh_token", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
  },
});

module.exports = RefreshToken;