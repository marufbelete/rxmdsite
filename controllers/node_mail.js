import nodemailer from 'nodemailer';
import { google} from 'googleapis';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import User from "../model/user";
import { sendEmail } from '../service/send_email';

const resetEmail = async (req,res,next) => {
    try {
      const email=req.body.email
      const token = jwt.sign({ email:email},process.env.SECRET,{expiresIn:'20m'});
      const mailOptions = {
        from:process.env.EMAIL,
        to: email,
        subject: 'Password Reseting Link',
        text: 'Follow the link to reset your password you will have ten minute before the link expired!',
        html:`${process.env.RESET_LINK}/${token}`
      };
      await sendEmail(email,mailOptions)
      return res.json({status:true,message:'email sent.'})
    }
    catch(err){
  next(err)
    }
  }
  
  const resetPassword=async(req,res,next)=>{
    try{
    const token= req.params.token
    const {password,confirmPassword}=req.body
    if(password!==confirmPassword)
  {
    const error = new Error("password doesn't match. please try again.")
    error.code = 403
    throw error; 
  }
    jwt.verify(token, process.env.SECRET, async(err, user) => {
    if (err) {
      if(err.name == "TokenExpiredError")
      {
        return res.status(403).json({ message: "your link expired please try again" });
        
      }
      return res.status(403).json({ message: "invalid token" });
    }
    else{
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      await User.findByIdAndUpdate({username:user.email},{
        password:passwordHash
      })
        return res.json({reset:true,success:true})
    }
  })
   }
  catch(err){
    next(err)
      }
  
  }

  export{
    resetEmail,
    resetPassword
  }
  