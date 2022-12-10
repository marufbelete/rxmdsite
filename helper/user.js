const User=require('../models/userModel')
const jwt= require('jsonwebtoken')
const bcrypt= require('bcryptjs')

const isEmailExist=async(email)=>{
        const user = await User.findOne({where:{email:email}})
        return user 
}
const isUsernameExist=async(username)=>{
    const user = await User.findOne({where:{username:username}})
    return user 
}
const isPasswordCorrect=async(incomingPassword,existingPassword)=>{
    const isMatch = await bcrypt.compare(incomingPassword,existingPassword)
    return isMatch

}
//check which data to sign
const issueToken = async function(id,role,key) {
    const token = jwt.sign({ sub:id,role}, key);
    return token
  }
const hashPassword=async(password)=>{
    const salt = await bcrypt.genSalt(10);
    const hashed=await bcrypt.hash(password, salt);
    return hashed;
}
const isEmailVerified=async(email)=>{
    const user= await User.findOne({where:{email:email}})
    return user?.isEmailVerified
}
const userIp=async(request)=>{
    let ip = request.headers["x-forwarded-for"] ||
     request.socket.remoteAddress;
     return ip

}

module.exports={
    isEmailExist,
    isUsernameExist,
    isPasswordCorrect,
    isEmailVerified,
    issueToken,
    hashPassword,
    userIp
}
