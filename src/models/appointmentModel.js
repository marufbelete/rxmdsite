const Sequelize = require("sequelize");
const sequelize = require("./index");

const Appointment = sequelize.define("appointment", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  patientFirstName:{
    type:Sequelize.STRING
  },
  patientLastName:{
    type:Sequelize.STRING
  },
  patientEmail:{
    type:Sequelize.STRING
  },
  message:{
    type:Sequelize.STRING
  },
  patientPhoneNumber:{
    type:Sequelize.STRING
  },
  paymentStatus:{
    type: Sequelize.BOOLEAN,
    defaultValue: false 
  },
  appointmentStatus:{
    type: Sequelize.ENUM("pending","in progress", "compeleted"),
    defaultValue: "in progress"
  },
  appointmentDateTime:{
   type:Sequelize.DATE
  },
  zoomUrl:{
    type:Sequelize.STRING
  },

});


module.exports = Appointment ;
