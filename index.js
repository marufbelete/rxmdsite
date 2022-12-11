const express = require("express");
const logger = require("morgan");
const path = require("path")
const cors = require("cors");
const serverless = require("serverless-http");
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const serverlessHandler = serverless(app);
require('dotenv').config();
const sequelize=require('./models/index')
const user_route=require('./routes/userRoutes')

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '/config')
var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(passport.initialize());

// Use static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
// app.post("api/payments", require("./functions/handlePayment"));
require("./routes/viewRoutes")(app);
app.use(user_route);
module.exports = serverlessHandler;
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


