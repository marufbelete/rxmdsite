const Sequelize = require("sequelize");
const sequelize = require("./index");
// const sequelizePaginate = require("sequelize-paginate");
const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  product_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
  discount: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  stock: {
    type: Sequelize.INTEGER,
  },
  tax: {
    type: Sequelize.DECIMAL,
  },
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  type:{
    type: Sequelize.ENUM("product", "treatment","fitness plan","meal plan"),
    defaultValue: "product"
  },
  productCatagory:{
    type: Sequelize.ENUM("long term", "short term","other"),
    defaultValue: "short term"
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

// sequelizePaginate.paginate(Product);
module.exports = Product;
