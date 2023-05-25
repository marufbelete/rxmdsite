const Sequelize = require("sequelize");
const sequelize = require("./index");

const Meal = sequelize.define("meal", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  age: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
gender: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
heightFeet: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
heightInches: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
fitnessLevel: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
bodyWeight: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
fitnessGoal: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
workoutPreference: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
  exerciseLimitation: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
  workoutFrequency: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
  workoutDuration: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
  availableEquipment: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
  restAndRecovery: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
healthCondition: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
currentMedication: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
gptResponse:{
    type: Sequelize.TEXT('long'),
    allowNull: true,
  },
 
});

module.exports = Meal;
