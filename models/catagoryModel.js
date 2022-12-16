const Sequalize = require("sequelize");
const sequelize = require("./index");

const Catagory = sequelize.define("catagory", {
id: {
  type: Sequalize.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false
},
catagory_name: {
    type: Sequalize.STRING,
    allowNull: false
}
});

module.exports = Catagory;
