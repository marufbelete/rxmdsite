const Sequelize = require("../config/default.json").sequelize;

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: "customer",
    },
    googleId: {
      type: Sequelize.STRING,
      allowNull: false
    },
  });
};
