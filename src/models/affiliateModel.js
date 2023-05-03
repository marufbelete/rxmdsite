const Sequelize = require("sequelize");
const sequelize = require("./index");

const Affliate = sequelize.define("affliate", {
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
 isDeemed: {
    type: Sequelize.BOOLEAN,
    defaultValue:false
  },
  status:{
    type: Sequelize.ENUM("paid", "pending", "not paid"),
    defaultValue: "not paid"
  },
  batchId: {
    type: Sequelize.STRING,
  },
});

module.exports = Affliate;
