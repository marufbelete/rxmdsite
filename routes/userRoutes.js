const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const config = require('config');
const passport = require('passport');

// @route   POST api/users
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Username is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
      user = new User({
        username,
        email,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile'] // Request access to the user's profile
}));

// The /auth/google/callback route, which will be called by Google after the user grants permission
router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/', // Redirect to the main page after successful authentication
  failureRedirect: '/login' // Redirect to the /login route after failed authentication
}));

// Define the /login route, which will be used to log the user in
router.get('/login', (req, res) => {
  // Render the login page, which will show a login form
  res.render('../views/login.html');
});

module.exports = router;
