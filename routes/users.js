const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route     POST api/users
// @desc      Register a user
// @access    Public
router.post(
  '/',
  [
    check('name', 'Please enter a name.').not().isEmpty(),
    check('email', 'Please enter a valid email.').isEmail(),
    check(
      'password',
      'Please enter a password with 8 or more characters.'
    ).isLength({ min: 8 }),
    check('regno', 'Please enter your registration number.').not().isEmpty(),
    check('username', 'Please enter a username.').not().isEmpty(),
    check('college', 'Please enter a college name.').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, regno, username, college } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'User already exists.' });
      }

      user = await User.findOne({ username });

      if (user) {
        return res
          .status(400)
          .json({ msg: 'Please choose a different username.' });
      }

      user = new User({
        name,
        email,
        password,
        regno,
        username,
        college,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1m',
      });

      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error.')
    }
  }
);

module.exports = router;
