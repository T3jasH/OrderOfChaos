const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const isLoggedIn = require('../middleware/isLoggedIn');

// @route     GET api/auth
// @desc      Get logged in user
// @access    Private
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/auth
// @desc      Auth user and get token
// @access    Public
router.post(
  '/',
  [
    check('email', 'Please enter your email address.').isEmail(),
    check('password', 'Please enter your password.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'User not registered.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Wrong Password.' });
      }

      //check user is verified or not
      if(!user.isVerified) {
        return res.status(401).send({msg: 'Your Email has not been verified. Please click on resend'})
      }


      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '720h',
      });

    res.json({ token , msg: 'User successfully logged in!'});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
