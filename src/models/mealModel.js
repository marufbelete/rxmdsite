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
height: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
weight: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
allergies: {
    type: Sequelize.STRING(45),
  },
targetWeight: {
    type: Sequelize.STRING(45),
  },
activityLevel: {
    type: Sequelize.STRING(45),
  },
mealPreference: {
    type: Sequelize.STRING(45),
  },
dietaryRestrictions: {
    type: Sequelize.STRING(45),
  },
vegetarianProtienSource: {
    type: Sequelize.STRING(45),
  },
veganProtienSource: {
    type: Sequelize.STRING(45),
  },
 preferredCuisine: {
    type: Sequelize.STRING(45),
  },
  medicalConditions: {
    type: Sequelize.STRING(45),
  },
//   workoutFrequency: {
//     type: Sequelize.STRING(45),
//     allowNull: false,
//   },
//   workoutDuration: {
//     type: Sequelize.STRING(45),
//     allowNull: false,
//   },
//   availableEquipment: {
//     type: Sequelize.STRING(45),
//     allowNull: false,
//   },
//   restAndRecovery: {
//     type: Sequelize.STRING(45),
//     allowNull: false,
//   },
// healthCondition: {
//     type: Sequelize.STRING(45),
//     allowNull: false,
//   },
// currentMedication: {
//     type: Sequelize.STRING(45),
//     allowNull: false,
//   },
gptResponse:{
    type: Sequelize.TEXT('long'),
    allowNull: true,
  },
 
});

module.exports = Meal;
