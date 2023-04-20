const Sequelize = require("sequelize");
const sequelize = require("./index");

const Tracking = sequelize.define("track_order", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

Tracking.beforeCreate((instance, options) => {
  const expirationDate = new Date();
  // Set the expiration date to 30 days from now
  expirationDate.setDate(expirationDate.getDate() + 31); 
  instance.setDataValue('expirationDate', expirationDate);
});
// Drop the existing trigger if it exists
sequelize.query(`
  DROP TRIGGER IF EXISTS delete_expired_rows
`);

// sequelize.query(`
//   SELECT COUNT(*) AS count
//   FROM information_schema.triggers
//   WHERE trigger_schema = DATABASE()
//   AND trigger_name = 'delete_expired_rows'
// `).then(([results, metadata]) => {
//   const count = results[0].count;

//   if (count === 0) {
    // Create the trigger if it does not exist
    sequelize.query(`
      CREATE TRIGGER delete_expired_rows
      BEFORE INSERT ON track_orders
      FOR EACH ROW
      BEGIN
        DELETE FROM track_orders WHERE expirationDate < NOW();
      END;
    `);
  // }
// });

module.exports = Tracking;
