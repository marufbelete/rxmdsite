const Sequelize = require("sequelize");
const sequelize = require("./index");

const Podcast = sequelize.define("podcast", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  video_key: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  thumbnail_key: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

module.exports = Podcast;
