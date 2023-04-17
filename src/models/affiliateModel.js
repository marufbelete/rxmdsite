const Sequelize = require("sequelize");
const sequelize = require("./index");

const Affliate = sequelize.define("affliate", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
 isDeemed: {
    type: Sequelize.BOOLEAN,
    defaultValue:false
  },
});

module.exports = Affliate;
