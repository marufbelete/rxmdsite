const express = require("express");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const app = express();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "/config");
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
app.set("view engine", "ejs");

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
// app.post("api/payments", require("./functions/handlePayment"));

require("./routes/viewRoutes")(app);

// Handle unauthorized requests
const port = process.env.PORT || 7000;
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.sendFile(path.join(__dirname, "/views/pages/404"));
  }
});

// sequelize hasn't been declared - does this work?
// sequelize
//   .sync()
//   .then(async (result) => {
//     app.listen(port, () => {
//       console.log(`Listening on port ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

//Google login
passport.use(
  new GoogleStrategy(
    {
      clientID: "your-client-id",
      clientSecret: "your-client-secret",
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      // Store the user's Google profile information in the database
      // and generate a JWT token to be sent to the client
      User.findOrCreate({ where: { googleId: profile.id } })
        .then((user) => cb(null, user))
        .catch((err) => cb(err));
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
      },
      "your-jwt-secret",
      { expiresIn: "1h" }
    );
    res.redirect(`/home?token=${token}`);
  }
);

// Listen to incoming requests
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
