const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSOWRD,
  db: process.env.DB,
  dialect: process.env.DB_DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 50000,
    idle: 15000,
  },
};

<<<<<<< HEAD
module.exports = {
=======
export default {
>>>>>>> e39ae32c8a3f08b103cc73b623744cbe52f9be25
  config,
};
