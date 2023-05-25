const Sequelize = require("sequelize");
const sequelize = require("./index");

const Fitness = sequelize.define("fitness", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  age: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  gender: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        allowNull: false,
      },
  fitnessGoal: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  workoutPreference: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  exerciseLimitation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  workoutFrequency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  workoutDuration: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  availableEquipment: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  restAndRecovery: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  healthCondition: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  currentMedication: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  gptResponse:{
    type: Sequelize.TEXT('long'),
    allowNull: true,

  },
 
});

module.exports = Fitness;
