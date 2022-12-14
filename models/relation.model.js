
const Product = require('./productModel')
const ProductImage=require('./productimageModel')
const Brand = require('./brandModel')
const Catagory=require('./catagoryModel')
const Order=require('./orderModel')
const ProductSize=require('./productsizeModel')
const Shipping=require('./shippingModel')
const Payment=require('./paymentModel')
const User=require('./userModel')
const Role=require('./roleModel')
 const Relation=()=>{
   //product to productimage raltion
Product.hasMany(ProductImage,{
  foreignKey: 'productId'
})
ProductImage.belongsTo(Product)

//product to brand
Brand.hasMany(Product,{
  foreignKey: 'brandId'
})
Product.belongsTo(Brand)

//product to catagory
Catagory.hasMany(Product,{
  foreignKey: 'catagoryId'
})
Product.belongsTo(Catagory)

//product to order
Order.belongsToMany(Product,{
  through: 'ProductOrder',
  foreignKey: "orderId"
})
Product.belongsToMany(Order,{
  through: 'ProductOrder',
  foreignKey: "productId"
})

//product to productsize
ProductSize.belongsToMany(Product,{
  through: 'ProductProductSize',
  foreignKey: "product_sizeId",
})
Product.belongsToMany(ProductSize,{
  through: 'ProductProductSize',
  foreignKey: "productId",
})

//order to shipping
Shipping.hasMany(Order,{//
  foreignKey: 'shippingId'
})
Order.belongsTo(Shipping)

//order to payment
Payment.hasMany(Order,{//
  foreignKey: 'payment_methodId'
})
Order.belongsTo(Payment)

//order to user
User.hasMany(Order,{
  foreignKey: 'orderId'
})
Order.belongsTo(User,{
  foreignKey: 'productId'
})

//role to user
Role.hasMany(User,{
  foreignKey: 'roleId'
})
User.belongsTo(Role)

}
 module.exports = Relation;
