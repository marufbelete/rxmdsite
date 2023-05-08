const Sequelize = require("sequelize");
const sequelize = require("./index");

const Affiliate = sequelize.define("affiliate", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  amount:{
    type: Sequelize.DECIMAL,
    defaultValue:0
  },
  withdrawalType:{
    type: Sequelize.ENUM("discount", "cash", "NA"),
    defaultValue: "NA"
  },
  status:{
    type: Sequelize.ENUM("paid", "pending", "not paid"),
    defaultValue: "not paid"
  },
  batchId: {
    type: Sequelize.STRING,
  },
});

module.exports = Affiliate;
