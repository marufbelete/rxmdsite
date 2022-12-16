const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const isEmailExist = async (email) => {
    const user = await User.findOne({ where: { email: email }, include: ["role"] })
    return user
}
const isUsernameExist = async (username) => {
    const user = await User.findOne({ where: { username: username }, include: ["role"] })
    return user
}
const isPasswordCorrect = async (incomingPassword, existingPassword) => {
    const isMatch = await bcrypt.compare(incomingPassword, existingPassword)
    return isMatch

}
//check which data to sign
const issueToken = async function (id, role, key) {
    const token = jwt.sign({ sub: id, role }, key, { expiresIn: '24h' });
    return token
}
const issueLongtimeToken = async function (id, role, key) {
    const token = jwt.sign({ sub: id, role }, key, { expiresIn: '720h' });
    return token
}
const isTokenValid = async function (token) {
    const user = jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return null
        }
        return user
    });
    return user
}
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
}
const isUserAdmin = (req) => {
    if (req?.user?.role === "admin") {
        return true;
    }
    return false;
}
const isEmailVerified = async (email) => {
    const user = await User.findOne({ where: { email: email } })
    return user?.isEmailConfirmed
}
const userIp = (request) => {
    let ip = request.headers["x-forwarded-for"] ||
        request.socket.remoteAddress;
    return ip

}

module.exports = {
    isEmailExist,
    isUsernameExist,
    isPasswordCorrect,
    isEmailVerified,
    issueToken,
    issueLongtimeToken,
    hashPassword,
    userIp,
    isUserAdmin,
    isTokenValid
}
