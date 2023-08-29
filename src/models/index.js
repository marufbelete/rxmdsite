const Sequelize = require("sequelize");
const { config } = require("../config/default");

const sequelize = new Sequelize(config.db, config.user, config.password, {
  host: config.host,
  logging: false,
  dialect: config.dialect,
  timezone: config.timezone,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
  dialectOptions: {
    timezone: '+00:00', // Set the timezone of the MySQL server to 00:00 UTC
  },
  // retry: {
  //   match: [
  //     Sequelize.ConnectionError,
  //     error => /Lock wait timeout exceeded; try restarting transaction/.test(error.message)
  //   ],
  //   max: 2
  // },
});

module.exports = sequelize;
