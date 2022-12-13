const jwt = require("jsonwebtoken");
const User = require("../models/userModel")
const bouncer= require("../helper/bruteprotect")
const {
  isEmailExist,
  isUsernameExist,
  issueToken,
  hashPassword,
  isEmailVerified,
  isPasswordCorrect,
  isTokenValid,
} = require("../helper/user");
const { handleError } = require("../helper/handleError");
const { validationResult } = require("express-validator");
const { sendEmail } = require("../helper/send_email");


exports.registerUser=async(req, res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message:errors.array()[0].msg});
  }
  try {
    const { username, email, password,name } = req.body;
    const token = jwt.sign({ email:email},process.env.SECRET);
    const mailOptions= {
      from:process.env.EMAIL,
      to: email,
      subject: 'Account Confirmation Link',
      text: 'Follow the link to confirm your email!',
      html:`${process.env.CONFIRM_LINK}?verifyToken=${token}`
    };
    if (await isEmailExist(email)) {
      console.log(await isEmailVerified(email))
      if(await isEmailVerified(email))
      {
        handleError('User already exists with this email',400)
      }
      else{
        await sendEmail(mailOptions)
        return res.json({message:"check your email address"})
      }
    }
    if (await isUsernameExist(username)) {
      handleError('username exist',400)
    }
   const hashedPassword=await hashPassword(password)
    const user = new User({
      username,
      email,
      name,
      isLocalAuth:true,
      password:hashedPassword,
    });
    await user.save();
    await sendEmail(mailOptions)
    return res.json({message:"check your email address"})
  }
   catch (err) {
    next(err);
  }
}

// Login a user
exports.loginUser=async (req, res,next) => {
  // Check if email exists
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message:errors.array()[0].msg});
  }
  try{
    const { username, email, password} = req.body;
    const user=email? await isEmailExist(email):
    await isUsernameExist(username)
    if(user&&user.isLocalAuth)
    {
      //if not validated send email
      if(!user.isEmailConfirmed)
      {
        const token = jwt.sign({ email:user.email},process.env.SECRET);
        const mailOptions= {
          from:process.env.EMAIL,
          to: user.email,
          subject: 'Account Confirmation Link',
          text: 'Follow the link to confirm your email!',
          html:`${process.env.CONFIRM_LINK}?verifyToken=${token}`
        };
        await sendEmail(mailOptions)
        return res.json({message:"check your email address"})
      }
      
       if(await isPasswordCorrect(password,user.password)){
        const token = await issueToken(user.id,user.role,process.env.SECRET);
       const info={
        name:user.name,
        username:user.username,
        role:user.role,
        email:user.email
       }
        bouncer.reset (req);
        return res.json({token:token,auth:true,user:info})
       }
       handleError('username or password not correct',400)
    }
    handleError('username or password not correct',400)
  }
  catch(error){
    console.log(error)
    next(error)
  }
}
//forgot password
exports.forgotPassword=async(req,res,next)=>{
  try{
    const {email}=req.body
    const token = jwt.sign({ email:email},process.env.SECRET,{expiresIn:'40m'});
    const mailOptions= {
      from:process.env.EMAIL,
      to: email,
      subject: 'Account Confirmation Link',
      text: 'Follow the link to confirm your email!',
      html:`${process.env.CONFIRM_LINK}?verifyToken=${token}`
      };
      await sendEmail(mailOptions)
      return res.json({status:true,message:'email sent, please check your email.'})
 }
catch(err){
  next(err)
    }
}
//reset password
exports.resetPassword=async(req,res,next)=>{
  try{
  const token= req.params.token
  const {password}=req.body
  const user=await isTokenValid(token)
  const hashedPassword=hashPassword(password)
  await User.findByIdAndUpdate({username:user.email},{
    password:hashedPassword
  })
  return res.redirect(`http://localhost:7000/login`)
 }
catch(err){
  next(err)
    }
}
//confirm email
exports.confirmEmail=async (req, res,next) => {
  try{
    const {verifyToken} = req.query;
    const user=await isTokenValid(verifyToken)
    if(user){
      const userInfo=await User.findOne({where:{email:user.email}})
      userInfo.isEmailConfirmed=true
      await userInfo.save()
      return res.redirect('/')
    }
    return res.redirect('/login')
  }
  catch(error){
    next(error)
  }
}
//test for protected route
exports.protected=async(req,res,next)=>{
  return res.json({message:"protected"})
}
