const Product = require("./productModel");
const Orderproduct = require("./orderproduct");
const Order = require("./orderModel");
const User = require("./userModel");
const Role = require("./roleModel");

//UNUSED SHOP STUFF - SAVE FOR LATER
// const ProductSize = require("./productsizeModel");
// const Shipping = require("./shippingModel");
// const Brand = require('./brandModel')
// const Category = require('./categoryModel')
// const Payment = require("./paymentModel");

const Relation = () => {
  //product to order
  Order.belongsToMany(Product, {
    through: "ProductOrder",
    foreignKey: "orderId",
  });
  Product.belongsToMany(Order, {
    through: "ProductOrder",
    foreignKey: "productId",
  });

  //orderproduct to order
  Order.hasMany(Orderproduct, {
    foreignKey: "orderId",
  });
  Orderproduct.belongsTo(Order, {
    foreignKey: "orderId",
  });

  //order to user
  User.hasMany(Order, {
    foreignKey: "userId",
  });
  Order.belongsTo(User, {
    foreignKey: "userId",
  });

  //role to user
  Role.hasMany(User, {
    foreignKey: "roleId",
  });
  User.belongsTo(Role, {
    foreignKey: "roleId",
  });

  //Unused Shop Relations - Save for later
  //product to brand
  // Brand.hasMany(Product, {
  //   foreignKey: 'brandId'
  // })
  // Product.belongsTo(Brand, {
  //   foreignKey: 'brandId'
  // })

  //product to category
  // Category.hasMany(Product, {
  //   foreignKey: 'categoryId'
  // })
  // Product.belongsTo(Category, {
  //   foreignKey: 'categoryId'
  // })

  //product to productsize
  // ProductSize.belongsToMany(Product, {
  //   through: "ProductSize",
  //   foreignKey: "product_sizeId",
  // });
  // Product.belongsToMany(ProductSize, {
  //   through: "ProductSize",
  //   foreignKey: "productId",
  // });

  //order to shipping
  // Shipping.hasMany(Order, {
  //   foreignKey: "shippingId",
  // });
  // Order.belongsTo(Shipping, {
  //   foreignKey: "shippingId",
  // });

  //order to payment
  // Payment.hasMany(Order, {
  //   foreignKey: "paymentId",
  // });
  // Order.belongsTo(Payment, {
  //   foreignKey: "paymentId",
  // });
};
module.exports = Relation;
