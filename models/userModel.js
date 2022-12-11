const Sequalize=require('sequelize');
const sequelize = require("./index");

const User = sequelize.define("user", {
  name: {
    type: Sequalize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequalize.STRING,
    unique: true,
  },
  email: {
    type: Sequalize.STRING,
    allowNull: false,
    unique: true,
  },
  isEmailConfirmed:{
    type: Sequalize.BOOLEAN,
    defaultValue: false,
  },
  password: {
    type: Sequalize.STRING,
  },
  role: {
    type: Sequalize.STRING,
    defaultValue: "customer",
  },
  googleId: {
    type: Sequalize.STRING,
  },
  isLocalAuth:{
    type: Sequalize.BOOLEAN,
    defaultValue: false,
  }
});
module.exports = User;
