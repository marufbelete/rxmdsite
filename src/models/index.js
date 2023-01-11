const Sequelize = require("sequelize");
const { config } = require("../config/default");

const sequelize = new Sequelize(config.db, config.user, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
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
