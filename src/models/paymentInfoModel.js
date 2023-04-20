const Sequelize = require("sequelize");
const sequelize = require("./index");

const PaymenInfo = sequelize.define("paymentinfo", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
 userProfileId: {
    type: Sequelize.STRING,
    defaultValue:false
  },
 userProfilePaymentId: {
    type: Sequelize.STRING,
    defaultValue:false
  },
cardLastDigit: {
    type: Sequelize.STRING,
    defaultValue:false
  },

});

module.exports = PaymenInfo;
