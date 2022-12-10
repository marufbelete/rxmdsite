const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const {isEmailExist,isUsernameExist,issueToken,
  hashPassword,isEmailVerified, isPasswordCorrect}=require('../helper/user');
const {handleError}=require('../helper/handleError');
const { validationResult }= require("express-validator");
 const {sendEmail}=require('../helper/send_email');

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
      if(await isEmailVerified(email))
      {
        handleError('User already exists with this email',400)
      }
      else{
        await sendEmail(mailOptions)
        return res.json({message:"check your email address"})
      }
    }
    if (await isUsernameExist(username) && await isEmailVerified(email)) {
      handleError('username exist',400)
    }
   const hashedPassword=await hashPassword(password)
    const user = new User({
      username,
      email,
      name,
      password:hashedPassword,
    });
    await user.save();
    await sendEmail(mailOptions)
    return res.json({message:"check your email address"})
  }
   catch (err) {
    console.error(err);
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
    console.log(req.body)
    const user=email? await isEmailExist(email):
    await isUsernameExist(username)
    console.log(user)
    if(user)
    {
      //check if validated or not
      //if not validated send email
      //else do this
       if(await isPasswordCorrect(password,user.password)){
        const token = await issueToken(user.id,user.role,process.env.SECRET);
      //  const {password,...info}=user
       const info={
        name:user.name,
        username:user.username,
        role:user.role,
        email:user.email
       }
        return res.json({token:token,auth:true,success:true,user:info})
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

exports.protected=async(req,res,next)=>{
  return res.json({message:"protected"})
}

