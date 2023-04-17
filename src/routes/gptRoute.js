const express=require('express')
const route=express.Router()
const {createCompletion}=require('../chatGPT/createCompletion')
const { errorHandler } = require("../middleware/errohandling.middleware");
const { authenticateJWT } = require("../middleware/auth.middleware");

route.get('/chatCompliation',
authenticateJWT,
createCompletion,
errorHandler)