const Sequelize = require("sequelize");
const sequelize = require("./index");
// const sequelizePaginate = require("sequelize-paginate");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  isEmailConfirmed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  password: {
    type: Sequelize.STRING,
  },
  googleId: {
    type: Sequelize.STRING,
  },
  isLocalAuth: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  address: {
    type: Sequelize.STRING,
  },
  apt: {
    type: Sequelize.STRING,
  },
  city: {
    type: Sequelize.STRING,
  },
  zip_code: {
    type: Sequelize.STRING,
  },
  state: {
    type: Sequelize.STRING,
  },
  country: {
    type: Sequelize.STRING,
  },
  phone_number: {
    type: Sequelize.STRING,
  },
  active: {
    type: Sequelize.TINYINT,
  },
  intake: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  left_appointment:{
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  appointment:{
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  affiliateLink: {
    type: Sequelize.STRING,
  },
 
});

// sequelizePaginate.paginate(User);
module.exports = User;
