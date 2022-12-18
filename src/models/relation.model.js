
const Product = require('./productModel')
const Orderproduct = require('./orderproduct')
const Brand = require('./brandModel')
const Category = require('./categoryModel')
const Order = require('./orderModel')
const ProductSize = require('./productsizeModel')
const Shipping = require('./shippingModel')
const Payment = require('./paymentModel')
const User = require('./userModel')
const Role = require('./roleModel')

const Relation = () => {
  //product to brand
  Brand.hasMany(Product, {
    foreignKey: 'brandId'
  })
  Product.belongsTo(Brand, {
    foreignKey: 'brandId'
  })

  //product to category
  Category.hasMany(Product, {
    foreignKey: 'categoryId'
  })
  Product.belongsTo(Category, {
    foreignKey: 'categoryId'
  })

  //product to order
  Order.belongsToMany(Product, {
    through: 'ProductOrder',
    foreignKey: "orderId"
  })
  Product.belongsToMany(Order, {
    through: 'ProductOrder',
    foreignKey: "productId"
  })

  //product to productsize
  ProductSize.belongsToMany(Product, {
    through: 'ProductSize',
    foreignKey: "product_sizeId",
  })
  Product.belongsToMany(ProductSize, {
    through: 'ProductSize',
    foreignKey: "productId",
  })
  //orderproduct to order
  Order.hasMany(Orderproduct, {
    foreignKey: 'orderId'
  })
  Orderproduct.belongsTo(Order, {
    foreignKey: 'orderId'
  })


  //order to shipping
  Shipping.hasMany(Order, {
    foreignKey: 'shippingId'
  })
  Order.belongsTo(Shipping, {
    foreignKey: 'shippingId'
  })

  //order to payment
  Payment.hasMany(Order, {
    foreignKey: 'paymentId'
  })
  Order.belongsTo(Payment, {
    foreignKey: 'paymentId'
  })

  //order to user
  User.hasMany(Order, {
    foreignKey: 'userId'
  })
  Order.belongsTo(User, {
    foreignKey: 'userId'
  })

  //role to user
  Role.hasMany(User, {
    foreignKey: 'roleId'
  })
  User.belongsTo(Role, {
    foreignKey: 'roleId'
  })

}
module.exports = Relation;
