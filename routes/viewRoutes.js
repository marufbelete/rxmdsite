module.exports = (app) => {
  const path = require("path");
  const router = require("express").Router();

  router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "/views/index.html"));
  });

  router.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "/views/about.html"));
  });

  router.get("/services", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "/views/services.html"));
  });

  router.get("/contact", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "/views/contact.html"));
  });

  router.get("/getstarted", function (req, res) {
    res.redirect("https://form.jotform.com/212587273457161");
  });

  router.get("/shop", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "/views/index.html"));
  });

  router.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "/views/login.html"));
  });

  app.use("/", router);
};
