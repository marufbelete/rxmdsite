const express = require("express");
const port = process.env.PORT || 3000;
const jwt = require("jsonwebtoken");
const logger = require("morgan");
const path = require("path")
const cors = require("cors");
const db = require("./models");
const serverless = require("serverless-http");
const app = express();
const serverlessHandler = serverless(app);
db.sequelize.sync();
process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '/config')
var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use(logger("dev"));

// Use static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
// app.post("api/payments", require("./functions/handlePayment"));
require("./routes/viewRoutes")(app);
module.exports = serverlessHandler;

// Handle unauthorized requests
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.sendFile(path.join(__dirname, "/views/404.html"));
  }
});

// Listen to incoming requests
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
