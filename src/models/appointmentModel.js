const Sequelize = require("sequelize");
const sequelize = require("./index");

const Appointment = sequelize.define("track_order", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  }
 

});


module.exports = Appointment ;
