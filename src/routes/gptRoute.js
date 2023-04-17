const express=require('express')
const route=express.Router()
const {createCompletion}=require('../chatGPT/createCompletion')
const { authenticateJWT } = require("../middleware/auth.middleware");
route.post('/chatcompliation',
// authenticateJWT,
createCompletion)

module.exports=route