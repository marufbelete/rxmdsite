const Subscription = require("../models/subscriptionModel");
const { Op, literal } = require('sequelize');
const { runJob } = require('../helper/cron_job');
const {chargeCreditCardExistingUser}=require('../functions/handlePayment')
const SubscriptionPayment = require("../models/subscriptionPaymentDetailModel");
const User = require("../models/userModel");
let payCronJob=null

const getActiveSubscriptions=async()=>{
  const subscriptions=await Subscription.findAll({where: {
    status:{ [Op.or]:['active','start']} ,
    period: {
      [Op.gt]:literal('currentPeriod'),
    },
  }})
  return subscriptions
}
const getStartedSubscriptions=async()=>{
  const subscriptions=await Subscription.findAll({where: {
    status: 'start',
    period: {
      [Op.gt]: literal('currentPeriod')
    },
  }})
  return subscriptions
}

// const scheduleSubscription=async(subscription,profile,paymentProfile,t={})=>{
//     // const subscription=await Subscription.findByPk(subscriptionId)
//     console.log(subscription)
//     const initialExecutionDate = new Date(subscription.createdAt);
//     initialExecutionDate.setMonth(initialExecutionDate.getMonth() + 1); // Add one month to the current date
//     const cronSchedulePattern = `${initialExecutionDate.getSeconds()} ${initialExecutionDate.getMinutes()} ${initialExecutionDate.getHours()} ${initialExecutionDate.getDate()} * *`;
//     payCronJob=runJob(cronSchedulePattern,async()=>{
//       subscriptionPaymentSchedule(subscription,profile,paymentProfile,t)
//       ;
//     })
// }

const paySubscriptionCron=async()=>{
  try {
    const subscriptions=await getActiveSubscriptions()
    if(subscriptions){
    for(let subscription of subscriptions){
      const initialExecutionDate = new Date(subscription.createdAt);
      // const runEveryFiveMinute='*/4 * * * *'
      const cronSchedulePattern = `${initialExecutionDate.getSeconds()} ${initialExecutionDate.getMinutes()} ${initialExecutionDate.getHours()} ${initialExecutionDate.getDate()} * *`;
      payCronJob=runJob(cronSchedulePattern,async()=>{
        subscriptionPayment(subscription.id)
        ;
      })
     }
    }
  } catch (error) {
    console.log(error)
  }
}

const paySubscriptionFirstTimeCron=async()=>{
try{
  const subscriptions=await getStartedSubscriptions()
  if(subscriptions){
    for(let subscription of subscriptions){
      const initialExecutionDate = new Date(subscription.createdAt);
      // const runEveryFiveMinute='*/4 * * * *'
      const cronSchedulePattern = `${initialExecutionDate.getSeconds()} ${initialExecutionDate.getMinutes()} ${initialExecutionDate.getHours()} ${initialExecutionDate.getDate()} * *`;
      payCronJob=runJob(cronSchedulePattern,async()=>{
        subscriptionPayment(subscription.id);
      })
     }
  }
  }
  catch(error){
    console.log(error)
  }
}

const subscriptionPayment=async(subscriptionId) =>{
  try {
    const subscription=await Subscription.findByPk(subscriptionId,{
      include:['paymentinfo','product']
    })
    console.log(subscription)
    console.log(subscriptionId)
    if(subscription.period>subscription.currentPeriod){
      if(subscription.currentPeriod+1===subscription.period){
        subscription.status="ended"
      }
      if(subscription.status==='start'){
        subscription.status="active"
      }
    const amount=subscription.paymentAmount
    console.log(subscription.paymentinfo)
    const customer_profile_id=subscription.paymentinfo.userProfileId
    const customer_payment_profile_id=subscription.paymentinfo.userProfilePaymentId
      subscription.currentPeriod=subscription.currentPeriod+1
      const payment_response=await chargeCreditCardExistingUser(amount,customer_profile_id,customer_payment_profile_id)
      await SubscriptionPayment.create({
        subscriptionId:subscription.id,
        transId:payment_response.transId
       })
       const plan_type=subscription.product.type
       let update_plan={}
       if(plan_type==='meal plan'){update_plan.mealPlan=true}
       if(plan_type==='fitness plan'){update_plan.exercisePlan=true}
       await User.update({...update_plan},{where:{id:subscription.userId}})
       await subscription.save()
      return
    }
    if(payCronJob)payCronJob.cancel()
    return
  } catch (error) {
    console.log(error)
  }
  
}

// const subscriptionPaymentSchedule=async(subscription,profile,paymentProfile) =>{
//   if(subscription.period>subscription.currentPeriod){
//     if(subscription.currentPeriod+1===subscription.period){
//       subscription.status="ended"
//     }
//     const amount=subscription.paymentAmount
//     subscription.currentPeriod=subscription.currentPeriod+1
//     await subscription.save({...t})
//     return await chargeCreditCardExistingUser(amount,profile,paymentProfile)
//   }
//   if(payCronJob)payCronJob.cancel()
//   return
// }

module.exports={
  paySubscriptionCron,
  paySubscriptionFirstTimeCron
  // scheduleSubscription
}