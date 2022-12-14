const Sequalize = require("sequelize");
const sequelize = require("./index");

const Catagory = sequelize.define("catagory", {
id: {
  type: Sequalize.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false
},
url: {
    type: Sequalize.STRING(45),
    allowNull: false
}
});

module.exports = Catagory;
