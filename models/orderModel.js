const Sequelize = require("../config/default.json").sequelize;

module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    orderId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    orderDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
};
