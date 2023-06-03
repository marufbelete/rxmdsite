const express=require('express')
const route=express.Router()
const {chatCompletion}=require('../controllers/chatController')
const { authenticateJWT } = require("../middleware/auth.middleware");
route.post('/chatcompliation',
// authenticateJWT,
chatCompletion)

module.exports=route