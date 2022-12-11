const Sequelize = require("sequelize");
const {config} = require("../config/default").default

const sequelize = new Sequelize(config.db, config.user, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle
  }
});

module.exports = sequelize;
// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.orders = require("./orderModel.js")(sequelize, Sequelize);
// db.products = require("./productModel.js")(sequelize, Sequelize);
// db.users = require("./userModel.js")(sequelize, Sequelize);

// module.exports = db;
