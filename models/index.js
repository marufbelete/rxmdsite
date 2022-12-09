const Sequelize = require("sequelize");
const dbconfig = require("../config/default.json")
const sequelize = new Sequelize(dbconfig.db, dbconfig.user, dbconfig.password, {
  host: dbconfig.host,
  dialect: dbconfig.dialect,
  pool: {
    max: dbconfig.pool.max,
    min: dbconfig.pool.min,
    acquire: dbconfig.pool.acquire,
    idle: dbconfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.orders = require("./orderModel.js")(sequelize, Sequelize);
db.products = require("./productModel.js")(sequelize, Sequelize);
db.users = require("./userModel.js")(sequelize, Sequelize);

module.exports = db;
