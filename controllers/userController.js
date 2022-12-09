const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');

// Sign up a new user
router.post('/signup', async (req, res) => {
  // Check if email already exists
  const emailExists = await User.findOne({ where: { email: req.body.email } });
  if (emailExists) return res.status(400).send('Email already exists');

  // Hash password
  const salt = await bcrypt.genSalt(10);
  console.log(bcrypt.hash('member', salt));
  console.log(bcrypt.hash('admin', salt));
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    // Save user to database
    const savedUser = await user.save();
    // Create and assign a JWT token
    const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login a user
router.post('/login', async (req, res) => {
  // Check if email exists
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) return res.status(400).send('Email or password is incorrect');

  // Check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Email or password is incorrect');

  // Create and assign a JWT token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
});

module.exports = router;
