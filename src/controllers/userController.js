const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const bouncer = require("../helper/bruteprotect");
const Product = require("../models/productModel");
const { Op } = require("sequelize");
const path = require("path");
const moment = require('moment');
const momentZone = require("moment-timezone");
const util = require('util');
const QRCode = require('qrcode');
const asyncVerify = util.promisify(jwt.verify);
const {
  isEmailExist,
  issueToken,
  hashPassword,
  isEmailVerified,
  isPasswordCorrect,
  isTokenValid,
  get2faVerfication,
  verify2faVerfication,
  getAffiliatePayableAmount,
  generateOtp,
  getProviders,
  getAppointmentsByFilter
} = require("../helper/user");
const { handleError } = require("../helper/handleError");
const { validationResult } = require("express-validator");
const { sendEmail ,sendOtpEmail, sendAffiliatePaidEmail} = require("../helper/send_email");
const { removeEmptyPair } = require("../helper/reusable");
const { sendPayout } = require("../functions/paypal");
const Affiliate = require("../models/affiliateModel");
const filePath = path.join(__dirname,"..","..",'public', 'images','testrxmd.gif');
exports.registerUser = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const { first_name, last_name, email, password} = req.body;
    const {affiliatedBy}=req.query;
    const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET);
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "TestRxMD Account Confirmation Link",
      html: `
      <div style="margin:auto; max-width:650px; background-color:#C2E7FF">
      <h1 style="text-align:center;color:#2791BD;padding:10px 20px;">
      TestRxMD Email Confirmation
      </h1>
      <p style="text-align:start;padding:10px 20px;">
      Follow the link to confirm your email.
      <a href="${process.env.BASE_URL}/confirm?verifyToken=${token}">click here<a/>
      </p>
      <div style="text-align:center;padding-bottom:30px">
      <img src="cid:unique@kreata.ae"/>
      </div>
      </div>
    `,
    attachments: [{
      filename: 'testrxmd.gif',
      path: filePath,
      cid: 'unique@kreata.ae' //same cid value as in the html img src
    }]
    };
    if (await isEmailExist(email)) {
      if (await isEmailVerified(email)) {
        handleError("User already exists with this email", 400);
      }
      else {
        const hashedPassword = await hashPassword(password);
        User.update(
          {
            first_name,
            last_name,
            password: hashedPassword,
          },
          { where: { email: email } }
        );
        await sendEmail(mailOptions);
        return res.json({ success: true });
      }
    }
    const user_role = await Role.findOne({ where: { role: "user" } });
    const hashedPassword = await hashPassword(password);
    let affiliating_user=null
    if(affiliatedBy){
      affiliating_user=await User.findOne({where:{affiliateLink:affiliatedBy}})
    }
    //affiliatedBy:userId
    const user = new User({
      first_name,
      last_name,
      email,
      roleId: user_role.id,
      password: hashedPassword,
      isLocalAuth: true,
      affiliatedBy:affiliating_user?.id
    });
    await user.save();
    //create client on the vcita
    
    await sendEmail(mailOptions);
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Login a user
exports.loginUser = async (req, res, next) => {
  // Check if email exists
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const { login_email, login_password, rememberme } = req.body;
    const user = login_email && (await isEmailExist(login_email));
    if (user && user.isLocalAuth && user.isActive) {
      //if not validated send email
      if (!user.isEmailConfirmed) {
        const token = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET);
        const mailOptions = {
          from: process.env.EMAIL,
          to: login_email,
          subject: "Account Confirmation Link",
          html: `
          <div style="margin:auto; max-width:650px; background-color:#C2E7FF">
          <h1 style="text-align:center;color:#2791BD;padding:10px 20px;">
          TestRxMD Email Confirmation
          </h1>
          <p style="text-align:start;padding:10px 20px;">
          Follow the link to confirm your email.
          <a href="${process.env.BASE_URL}/confirm?verifyToken=${token}">click here<a/>
          </p>
          <div style="text-align:center;padding-bottom:30px">
          <img src="cid:unique@kreata.be"/>
          </div>
          </div>
        `,
        attachments: [{
          filename: 'testrxmd.gif',
          path: filePath,
          cid: 'unique@kreata.be' //same cid value as in the html img src
        }]
          
        };
        await sendEmail(mailOptions);
        handleError(
          "It seems like you haven't verified your email yet. Please check your email for the confirmation link.",
          400
        );
      }
      if (await isPasswordCorrect(login_password, user.password)) {
        
          const access_token = rememberme
          ? await issueToken(
            user.id,
            user.role?.role,
            login_email,
            rememberme,
            process.env.ACCESS_TOKEN_SECRET,
            process.env.LONG_ACCESS_TOKEN_EXPIRY
          )
          : await issueToken(
             user.id, 
             user.role.role,
             login_email,
             rememberme,
             process.env.ACCESS_TOKEN_SECRET,
             process.env.ACCESS_TOKEN_EXPIRES);

        const info = {
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          email: user.email,
        };
        bouncer.reset(req);
        const token_expiry=rememberme?
        process.env.LONG_ACCESS_TOKEN_EXPIRY:
        process.env.ACCESS_TOKEN_EXPIRES
        const currentDate = new Date();
        console.log(token_expiry,rememberme)
        const cookie_expires = moment(currentDate).add(token_expiry.match(/^(\d+)/)[1],'days').toDate();
        res.cookie('access_token',access_token, {
          path: "/",
          httpOnly:true,
          expires:cookie_expires,
          // secure: true,
        })
      
        return res
          .status(200)
          .json({ auth: true, info, intakeFilled:user.intake });
      }
      handleError("Username or Password Incorrect", 400);
    }
    handleError("Username or Password Incorrect", 400);
  } catch (err) {
    next(err);
  }
};
//get user
exports.getUsers = async (req, res, next) => {
  try {
    const options = {
      include: ["role"],
      order: [["first_name", "DESC"]],
    };
    const users = await User.findAll(options);
    return res.json(users);
  } catch (err) {
    next(err);
  }
};
//get user by id
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { include: ["role"] });
    return res.json(user);
  } catch (err) {
    next(err);
  }
};
//get user by email
exports.getUserByStatus = async (req, res, next) => {
  try {
    let queryString
    const { email, name } = req.query;
    if (email) { queryString = { email: email } }
    if (name) {
      queryString = {
        [Op.or]: [{ first_name: { [Op.like]: `%${name}%` } },
        { last_name: { [Op.like]: `%${name}%` } }]
      }
    }
    const user = await User.findAll(
      { where: queryString, include: ["role"] });
    return res.json(user);
  } catch (err) {
    next(err);
  }
};
// get current loged user
exports.getCurrentLoggedUser = async (req, res, next) => {
  try {
    const id = req.user.sub;
    const user = await User.findByPk(id, { include: ["role"] });
    return res.json(user);
  } catch (err) {
    next(err);
  }
};
//update user info
exports.updateUserInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.body.password) {
      delete req.body.password;
    }
    const new_user_info = removeEmptyPair(req.body)
    const updated_user = await User.update(
      { ...new_user_info },
      { where: { id: id } }
    );
    return res.json(updated_user);
  } catch (err) {
    next(err);
  }
};
//change user state
exports.updateUserState = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { state } = req.body
    const updated_user = await User.update(
      { isActive: state },
      { where: { id: id } }
    );
    return res.json(updated_user);
  } catch (err) {
    next(err);
  }
};
//change password
exports.changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    const id = req.user.sub;
    const user = await User.findByPk(id);
    if (!user) {
      handleError("user not found", 403);
    }
    if(!user.isLocalAuth){
      handleError("This account uses google authentication.", 403);
    }
    const { old_password, new_password } = req.body;
    if (await isPasswordCorrect(old_password, user.password)) {
      const hashedPassword = await hashPassword(new_password);
      const updated_user = await User.update(
        { password: hashedPassword },
        { where: { id: id } }
      );
      return res.json(updated_user);
    }
    handleError("old password not correct", 403);
  } catch (err) {
    next(err);
  }
};
//forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user =await User.findOne({where:{email:email}})
    if(!user||!user.isLocalAuth||!user.isEmailConfirmed){
      handleError("User With this email not found to reset the password",403)
    }
    const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "2h",
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Link",
      html: `
      <div style="margin:auto; max-width:650px; background-color:#C2E7FF">
      <h1 style="text-align:center;color:#2791BD;padding:10px 20px;">
      TestRxMD Password Reset
      </h1>
      <p style="text-align:start;padding:10px 20px;">
      Follow the link to reset your password!.
      <a href="${process.env.BASE_URL}/resetpassword?token=${token}">click here<a/>
      </p>
      <div style="text-align:center;padding-bottom:30px">
      <img src="cid:unique@kreata.be"/>
      </div>
      </div>
    `,
    attachments: [{
      filename: 'testrxmd.gif',
      path: filePath,
      cid: 'unique@kreata.be' //same cid value as in the html img src
    }]
    };
    await sendEmail(mailOptions);
    return res.json({
      status: true,
      message:
        "password reset-link sent, please check your email. token will expired in 2 hour",
    });
  } catch (err) {
    next(err);
  }
};
//reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.query;
    const { password } = req.body;
    const user = await isTokenValid(token,process.env.ACCESS_TOKEN_SECRET);
    const user_info =await User.findOne({where:{email:user.email}})
    if(!user_info||!user_info.isLocalAuth||!user_info.isEmailConfirmed){
      handleError("User With this email not found to reset the password",403)
    }
    const hashedPassword = await hashPassword(password);
    await User.update(
      { password: hashedPassword },
      {
        where: { email: user.email },
      }
    );
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
//confirm email
exports.confirmEmail = async (req, res, next) => {
  try {
    const { verifyToken } = req.query;
    const user = await isTokenValid(verifyToken,process.env.ACCESS_TOKEN_SECRET);
    if (user) {
      const userInfo = await User.findOne({ where: { email: user.email } });
      userInfo.isEmailConfirmed = true;
      await userInfo.save();
      return res.redirect("/");
    }
    return res.redirect("/login");
  } catch (err) {
    next(err);
  }
};
exports.checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      handleError("please login", 403);
    }
    const user = await asyncVerify(token, process.env.ACCESS_TOKEN_SECRET)
    if (user && user?.sub) {
      const check_user = await User.findByPk(user?.sub)
      if (!check_user?.isActive) {
        handleError("This account is inactive, please contact our customer service", 403);
      }
      return res.json({ message: "success", auth: true, user: {...user,affiliateLink:check_user.affiliateLink} });
    }
    handleError("please login", 403);
  } catch (err) {
    next(err);
  }
};

exports.logOut = async (req, res, next) => {
  try {
    res
    return res.status(200).clearCookie('access_token').redirect("/login");
  } catch (err) {
    next(err);
  }
};

//contact for email
exports.contactFormEmail = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const { name, email, phone, subject, message } = req.body;
    const receiveOptions = {
      from: email,
      to: process.env.EMAIL,
      subject: subject,
      html: `
      <div style="margin:auto; max-width:650px; background-color:#C2E7FF">
      <h1 style="text-align:center;color:#2791BD;padding:10px 20px;">
      Customer Request
      </h1>
      <p style="text-align:start;padding:10px 20px;">
      You have message from client.
      </p>
      <p>${name && "Name:" + name}</p>
      <p>${phone && "Phone:" + phone}</p>
      <p>Email : ${email}</p>
      <p>Message: ${message}</p>
      <div style="text-align:center;padding-bottom:30px">
      <img src="cid:unique@kreata.ae"/>
      </div>
      </div>
    `,
    attachments: [{
      filename: 'testrxmd.gif',
      path: filePath,
      cid: 'unique@kreata.ae' //same cid value as in the html img src
    }]
    };
    await sendEmail(receiveOptions);
    //send automatic reply email
    const replyOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Request Recieved",
      html: `
      <div style="margin:auto; max-width:650px; background-color:#C2E7FF">
      <h1 style="text-align:center;color:#2791BD;padding:10px 20px;">
      TESTRXMD Request Recieved
      </h1>
      <p style="text-align:start;padding:10px 20px;">
      we got your request we will contact you soon.
      </p>
      <div style="text-align:center;padding-bottom:30px">
      <img src="cid:unique@kreata.ae"/>
      </div>
      </div>
    `,
    attachments: [{
      filename: 'testrxmd.gif',
      path: filePath,
      cid: 'unique@kreata.ae' //same cid value as in the html img src
    }]
    };
    await sendEmail(replyOptions);
    return res.json({
      message: "email successfuly sent",
    });
  } catch (err) {
    next(err);
  }
};



exports.getAvailableProvider = async (req, res, next) => {
  try {
  //  const userTimezone =req.query.userTimezone
  //  const userDateTime = moment.tz(appointmentDateTime,userTimezone).utc();
  //  momentZone.tz(appointmentDateTime, userTimezone);
  //  const utcDateTime = moment.utc(appointmentDateTime);
   const providers=await getProviders()
  

  //  const free_provider=[]
  //  //give two hour before and after appointment
  // //  const appointmentStartTime = userDateTime.clone().toDate();
  // //  const twoHoursAfter = userDateTime.clone().add(1, "hours").toDate();
  // if(providers.length<1) return res.json(free_provider)
  // for(let provider of providers){
  //   const options={
  //     where: {
  //       doctorId: provider.id,
  //       // appointmentDateTime: {
  //       //   [Op.between]: [appointmentStartTime, twoHoursAfter]
  //       // },
  //     },
  //   }
  //   const overlappingAppointments = await getAppointmentsByFilter(options);
  //   if(overlappingAppointments.length<1)free_provider.push(
  //     {id:provider.id,first_name:provider.first_name,
  //     last_name:provider.last_name})
  // }
   return res.json({providers})
  }
  catch(err){
   next(err)
  }
}
exports.getProviderSchedule = async (req, res, next) => {
  try {
   const providerId = req.params.providerId;
   const options={
    where:{
      doctorId: providerId
    },
    attributes:['appointmentDateTime']
   }
   const providerSchedule = await getAppointmentsByFilter(options);
   return res.json({providerSchedule})
  }
  catch(err){
   next(err)
  }
}

exports.getAffilateCode = async (req, res, next) => {
  try {
    const user=await User.findOne({where:{id:req?.user?.sub}});
    if(user.affiliateLink){
      const dataUrl=await QRCode.toDataURL(`${process.env.BASE_URL}/register?affiliatedBy=${user.affiliateLink}`)
      return res.json({src:dataUrl,url:`${process.env.BASE_URL}/register?affiliatedBy=${user.affiliateLink}`});
    }
    const link=Date.now()
    await User.update({affiliateLink:link},
    {where:{id:req?.user?.sub}});
    const dataUrl=await QRCode.toDataURL(`${process.env.BASE_URL}/register?affiliatedBy=${link}`)
    return res.json({src:dataUrl,url:`${process.env.BASE_URL}/register?affiliatedBy=${user.affiliateLink}`});
  }
  catch(err){
   next(err)
  }
}
exports.getOtp = async (req, res, next) => {
  try {
    const amount =await getAffiliatePayableAmount(req?.user?.sub)
    if(Number(amount)<20){
    handleError("not enough balance to withdraw",401)
    }
   const otp =await generateOtp(req?.user?.sub)
   const user=await User.findByPk(req?.user?.sub)
   await sendOtpEmail(otp,user.email)
   return res.json({otp});
  }
  catch(err){
   next(err)
  }
}
exports.confirmOtp = async (req, res, next) => {
  try {
    const otp=req.body.otp
    const valid= await verify2faVerfication(otp,req?.user?.sub)
    const user=await User.findOne({where:{id:req?.user?.sub}});
   if(valid){
   let amount =await getAffiliatePayableAmount(req?.user?.sub)
   //cash-out just 70% of the reward
   amount=Number(amount)*0.7
   if(amount<20){
    handleError("not enough balane to withdraw",401)
    }
   const batchId=Math.random().toString(36).substring(9)
   const note='TestRxmd affiliate payout'
   const payout=await sendPayout(user.email,amount,note,batchId)
   await Affiliate.update({batchId:payout?.batch_header?.payout_batch_id,status:"pending"},
    {where:{affilatorId:req?.user?.sub,withdrawalType:"NA"}})
    return res.json({message:"payout success, will let you know with email when transaction done"});
   }
   handleError("Invalid code, please try again",403)
  }
  catch(err){
   next(err)
  }
}
exports.getUserAffiliateDetail = async (req, res, next) => {
  try {
    const affilate_detail=await Affiliate.findAll({where:{affilatorId:req?.user?.sub},
      include:['buyer']})
    return res.json({affilate_detail})
  }
  catch(err){
   next(err)
  }
}
//change in dev
exports.create2FA = async (req, res, next) => {
  try {
    const Otp=await get2faVerfication(1)
    sendOtpEmail(Otp,"marufbelete9@gmail.com")
    return res.json('success')
  }
  catch(err){
   next(err)
  }
}
//change in dev
exports.verify2FA = async (req, res, next) => {
  try {
    const verify=await verify2faVerfication("066876",1)
    if(!verify){
      handleError("Wrong OTP please try again",403)
    }
    if(verify.delta===0)
    {
      return res.json({message:"successfully verified"})
    }
    else if(verify.delta<=-1){
      handleError("OTP key entered too late",403)
    }
  }
  catch(err){
   next(err)
  }
}

exports.adminDashboard = async (req, res, next) => {
  try {
    const options = {
      order: [["product_name", "ASC"]],
    };
    const products = await Product.findAll(options);
    const product_type=await Product.getAttributes().type.values;
    const product_catagory=await Product.getAttributes().productCatagory.values;
    return res.render(path.join(__dirname, "..", "/views/pages/dashboard"),
     { products,product_type,product_catagory });
  } catch (err) {
    next(err);
  }
};

exports.jotformWebhook = async (req, res, next) => {
  try {
    const { pretty } = req.body;
    const jot_pairs = pretty.replace(/\s/g, "").split(",");
    const jot_entries = jot_pairs.map((kv) => kv.split(":"));
    const jot_obj = Object.fromEntries(jot_entries);
    const token = jot_obj.token;
    const user = await isTokenValid(token,process.env.ACCESS_TOKEN_SECRET);
    await User.update(
      { intake: true },
      {
        where: { email: user.email },
      }
    );
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
