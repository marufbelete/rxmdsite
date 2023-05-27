const Product = require("./productModel");
const Orderproduct = require("./orderproduct");
const Order = require("./orderModel");
const User = require("./userModel");
const Role = require("./roleModel");
const Affiliate = require("./affiliateModel");
const Subscription=require("./subscriptionModel")
const PaymenInfo=require("./paymentInfoModel")
const Tracking=require("./trackingModel")
const Patientinfo=require("./patientInfoModel")
const Appointment=require("./appointmentModel")
const Fitness=require("./fitnessModel")
const Meal=require("./mealModel");
const SubscriptionPayment = require("./subscriptionPaymentDetailModel");

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
   User.hasMany(Affiliate,{
    foreignKey: 'buyerId',
    as: 'buyer'
  })
  Affiliate.belongsTo(User,{
    foreignKey: 'buyerId',
    as: 'buyer'
  })
   // user as patie with appoin
   User.hasMany(Appointment,{
    foreignKey: 'patientId',
    as: 'patient'
  })
  Appointment.belongsTo(User,{
    foreignKey: 'patientId',
    as: 'patient'
  })
   // user as doc with appoin
   User.hasMany(Appointment,{
    foreignKey: 'doctorId',
    as: 'doctor'
  })
  Appointment.belongsTo(User,{
    foreignKey: 'doctorId',
    as: 'doctor'
  })
   // product -appointment
   Product.hasMany(Appointment,{
    foreignKey: 'productId',
  })
  Appointment.belongsTo(Product,{
    foreignKey: 'productId',
  })
   // user as buyer-affiliate
   User.hasMany(Patientinfo,{
    foreignKey: 'userId',
  })
  Patientinfo.belongsTo(User,{
    foreignKey: 'userId',
  })
   // user meal plan
   User.hasMany(Meal,{
    foreignKey: 'userId',
  })
  Meal.belongsTo(User,{
    foreignKey: 'userId',
  })
   // user fitness plan
   User.hasMany(Fitness,{
    foreignKey: 'userId',
  })
  Fitness.belongsTo(User,{
    foreignKey: 'userId',
  })
   // product-patientinfo
   Product.hasMany(Patientinfo,{
    foreignKey: 'productId'
  })
  Patientinfo.belongsTo(Product,{
    foreignKey: 'productId'
    })
  // user as affliator-affiliate
  User.hasMany(Affiliate,{
    foreignKey: 'affilatorId',
    as: 'affilator'
  })
  Affiliate.belongsTo(User,{
    foreignKey: 'affilatorId',
    as: 'affilator'
  })

  // order-affiliate
  Order.hasOne(Affiliate,{
    foreignKey: 'orderId'
  })
  Affiliate.belongsTo(Order,{
    foreignKey: 'orderId'
  })
  // user-paymentinfo
  User.hasMany(PaymenInfo,{
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
   Product.hasMany(Subscription,{
    foreignKey: 'productId'
  })
  Subscription.belongsTo(Product,{
    foreignKey: 'productId'
  })
   // paymentinfo subscription
   PaymenInfo.hasMany(Subscription,{
    foreignKey: 'paymentId'
  })
  Subscription.belongsTo(PaymenInfo,{
    foreignKey: 'paymentId'
  })
   // paymentdetail subscription
   Subscription.hasMany(SubscriptionPayment,{
    foreignKey: 'subscriptionId'
  })
  SubscriptionPayment.belongsTo(Subscription,{
    foreignKey: 'subscriptionId'
  })

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
  //order-tracking
  Order.hasOne(Tracking, {
    foreignKey: "orderId",
  });
  Tracking.belongsTo(Order, {
    foreignKey: "orderId",
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
