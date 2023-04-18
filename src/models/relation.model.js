const Product = require("./productModel");
const Orderproduct = require("./orderproduct");
const Order = require("./orderModel");
const User = require("./userModel");
const Role = require("./roleModel");
const RefreshToken=require("./refreshToken.model");
const Affliate = require("./affiliateModel");
const Subscription=require("./subscriptionModel")
const PaymenInfo=require("./paymentInfoModel")

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
//new.......
 // user-user
  User.hasMany(User,{
    foreignKey: 'affiliatedBy',
    as:'affiliate'
  })
  User.belongsTo(User,{
    foreignKey: 'affiliatedBy',
    as:"affiliator"
  });

   // user as buyer-affiliate
   User.hasMany(Affliate,{
    foreignKey: 'buyerId',
    as: 'buyer'
  })
  Affliate.belongsTo(User,{
    foreignKey: 'buyerId',
    as: 'buyer'
  })
  // user as affliator-affiliate
  User.hasMany(Affliate,{
    foreignKey: 'affilatorId',
    as: 'affilator'
  })
  Affliate.belongsTo(User,{
    foreignKey: 'affilatorId',
    as: 'affilator'
  })

  // order-affiliate
  Order.hasOne(Affliate,{
    foreignKey: 'orderId'
  })
  Affliate.belongsTo(Order,{
    foreignKey: 'orderId'
  })
  // user-paymentinfo
  User.hasOne(PaymenInfo,{
    foreignKey: 'userId'
  })
  PaymenInfo.belongsTo(User,{
    foreignKey: 'userId'
  })
  // user-subscription
  User.hasMany(Subscription,{
    foreignKey: 'userId'
  })
  Subscription.belongsTo(User,{
    foreignKey: 'userId'
  })
   // user-product
   Product.hasOne(Subscription,{
    foreignKey: 'productId'
  })
  Subscription.belongsTo(Product,{
    foreignKey: 'productId'
  })
   //token to user
   User.hasMany(RefreshToken, {
    foreignKey: "userId",
  });
  RefreshToken.belongsTo(User, {
    foreignKey: "userId",
  });

//new.......
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
 };
module.exports = Relation;
