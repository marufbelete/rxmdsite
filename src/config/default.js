const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSOWRD,
  db: process.env.DB,
  dialect: process.env.DB_DIALECT,
  timezone:'Etc/UTC',
  pool: {
    max: 5,
    min: 0,
    acquire: 50000,
    idle: 15000,
  },
  
};
module.exports = {
  config,
};
