const Sequelize = require("sequelize");
const sequelize = require("./index");
// const sequelizePaginate = require("sequelize-paginate");

const Orderproduct = sequelize.define("order_product", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue:1
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  product_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  discount: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  description: {
    type: Sequelize.STRING,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  tax: {
    type: Sequelize.DECIMAL,
  },
  image_url: {
    type: Sequelize.STRING,
    get() {
      return this.getDataValue("image_url")?.split(";");
    },
    set(val) {
      this.setDataValue("image_url", val.join(";"));
    },
  },
});

// sequelizePaginate.paginate(Orderproduct);
module.exports = Orderproduct;
