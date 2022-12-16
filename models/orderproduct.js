const Sequalize = require("sequelize");
const sequelize = require("./index");
const sequelizePaginate = require('sequelize-paginate')

const Orderproduct = sequelize.define("order_product", {
  id: {
    type: Sequalize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  quantity: {
    type: Sequalize.INTEGER,
    allowNull: false,
  },
  productId: {
    type: Sequalize.INTEGER,
    allowNull: false,
  },
  product_name: {
    type: Sequalize.STRING,
    allowNull: false,
  },
  discount:{
    type: Sequalize.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  description: {
    type: Sequalize.STRING,
  },
  price: {
    type: Sequalize.FLOAT,
    allowNull: false,
  },
  tax: {
    type: Sequalize.DECIMAL,
  },
  image_url: {
    type:Sequalize.STRING,
    allowNull: false,
    get() {
        return this.getDataValue('image_url')?.split(';')
    },
    set(val) {
        this.setDataValue('image_url',val.join(';'));
    }
  },
  
});

sequelizePaginate.paginate(Orderproduct)
module.exports = Orderproduct;
