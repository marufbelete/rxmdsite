const express = require("express");
const logger = require("morgan");
const path = require("path")
const cors = require("cors");
const serverless = require("serverless-http");
const app = express();
const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const sequelize=require('./models/index');
const user_route=require('./routes/userRoutes');
const role_route=require("./routes/roleRoute")
const {googlePassport}=require("./auth/google");
const Relation=require('./models/relation.model')


const serverlessHandler = serverless(app);
process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '/config')
var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(passport.initialize());
googlePassport(passport);

// Use static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');

// Routes
app.use(user_route);
app.use(role_route);
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
// app.post("api/payments", require("./functions/handlePayment"));
require("./routes/viewRoutes")(app);
Relation()
// Handle unauthorized requests
const port = process.env.PORT || 7000;
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.sendFile(path.join(__dirname, "/views/404.html"));
  }
});
sequelize.sync().then(async(result)=>{
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}).catch(error=>{
    console.log(error)
  })

module.exports = serverlessHandler;