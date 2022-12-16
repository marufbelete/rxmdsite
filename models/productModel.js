const Sequalize = require("sequelize");
const sequelize = require("./index");
const sequelizePaginate = require('sequelize-paginate')
const Product = sequelize.define("product", {
id: {
  type: Sequalize.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false
  },
product_name: {
  type: Sequalize.STRING,
  allowNull: false,
},
price: {
  type: Sequalize.DECIMAL,
  allowNull: false
},
discount:{
  type: Sequalize.TINYINT,
  allowNull: false,
  defaultValue: 0
},
description: {
  type: Sequalize.STRING,
},
active: {
  type: Sequalize.BOOLEAN,
  allowNull: false,
  defaultValue: true
},
stock: {
  type: Sequalize.INTEGER,
  allowNull: false,
},
tax: {
  type: Sequalize.DECIMAL,
},
quantity: {
  type: Sequalize.INTEGER,
  defaultValue: 0,
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

sequelizePaginate.paginate(Product)
module.exports = Product;
