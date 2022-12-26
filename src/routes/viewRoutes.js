module.exports = (app) => {
  const path = require("path");
  const router = require("express").Router();

  router.get("/", function (req, res) {
    res.render(path.join(__dirname, "..", "/views/pages/index"));
  });

  router.get("/home", function (req, res) {
    res.render(path.join(__dirname, "..", "/views/pages/index"));
  });

  router.get("/about", function (req, res) {
    res.render(path.join(__dirname, "..", "/views/pages/about"));
  });

  router.get("/services", function (req, res) {
    res.render(path.join(__dirname, "..", "/views/pages/services"));
  });

  router.get("/contact", function (req, res) {
    res.render(path.join(__dirname, "..", "/views/pages/contact"));
  });

  router.get("/getstarted", function (req, res) {
    res.redirect("https://form.jotform.com/212587273457161");
  });

  router.get("/shop", function (req, res) {
    res.render(path.join(__dirname, "..", "/views/pages/shop"));
  });

  router.get("/cart", function (req, res) {
    res.render(path.join(__dirname, "..", "/views/pages/shop-cart"));
  });

  router.get("/checkout", function (req, res) {
    res.render(path.join(__dirname, "..", "/views/pages/shop-checkout"));
  });

  router.get("/products/details", function (req, res) {
    res.render(path.join(__dirname, "..", "/views/pages/shop-product-details"));
  });

  router.get("/login", function (req, res) {
    res.render(path.join(__dirname, "..", "/views/pages/login"));
  });

  router.get("/register", function (req, res) {
    res.render(path.join(__dirname, "..", "/views/pages/register"));
  });

  router.get("/registered", function (req, res) {
    res.render(path.join(__dirname, "..", "/views/pages/registerSuccess"));
  });

  router.get("/privacypolicy", function (req, res) {
    res.render(path.join(__dirname, "..", "/views/pages/privacyPolicy"));
  });

  app.use("/", router);
};
