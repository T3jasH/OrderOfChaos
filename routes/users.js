const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, regno, username, college } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ success: false, msg: 'User already exists.' });
      }

      user = await User.findOne({ username });

      if (user) {
        return res
          .status(400)
          .json({ success: false, msg: 'Please choose a different username.' });
      }

      user = new User({
        name,
        email,
        password,
        regno,
        username,
        college,
      });

      // const salt = await bcrypt.genSalt(10);

      // user.password = await bcrypt.hash(password, salt);

      //Get verify token
      const verifyToken = user.getVerifiedToken();
      await user.save({ validateBeforeSave: false });

      const msg = `Hello ${req.body.name} \n\n Please verify your account by clicking the link: \nhttp://${req.headers.host}/api/users/confirmation/${user.email}/${user.verifyToken}  \n\nThank You!\n`;
      try {
        const message = {
          to: user.email,
          from: process.env.FROM_EMAIL_NEW,
          subject: 'Verification',
          text: msg,
        };
        await sendEmail(message);
        res.status(200).json({ success: true, msg: 'Email Sent.' });
      } catch (err) {
        console.log(err);
        user.verifyToken = undefined;

        await user.save();
      }

      // const payload = {
      //   user: {
      //     id: user.id,
      //   },
      // };

      // const token = jwt.sign(payload, process.env.JWT_SECRET, {
      //   expiresIn: '720h',
      // });

      // res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, msg: 'Server Error.' });
    }
  }
);

// @route     GET api/users/confirmation/:email/:token
// @desc      Email Verify Confirmation
// @access    Public
router.get('/confirmation/:email/:token', async (req, res, next) => {
  const user = await User.findOne({ verifyToken: req.params.token });
  // if(!token) {
  //   return res.status(400).send({msg: 'Your verification link may have expired. Please click on resend to verify your Email'});
  // }

  // const  = await User.findOne({token});
  if (!user) {
    return res.status(401).json({
      success: false,
      msg:
        'Your verification link may have expired. Please click on resend to verify your Email.',
    });
  }

  if (user.isVerified) {
    return res.status(200).json({
      success: true,
      msg: 'User has been already verified. Continue to Login.',
    });
  } else {
    user.isVerified = true;
    await user.save(function (err) {
      if (err) {
        return res.status(500).json({ success: false, msg: err.message });
      } else {
        return res.status(200).json({
          success: true,
          msg: 'Your account has been successfully verified.',
        });
      }
    });
  }
});

// @route     POST api/users/resendEmail
// @desc      Resend Email
// @access    Public
router.post('/resendEmail', async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, msg: 'Unable to find a user with that email.' });
  }

  if (user.isVerified) {
    return res.status(200).json({
      success: true,
      msg: 'This account has already been verified. Continue to Login.',
    });
  }

  //send verification link
  const verifyToken = user.getVerifiedToken();
  await user.save({ validateBeforeSave: false });

  const msg = `Hello Participant \n\n Please verify your account by clicking the link: \nhttp://${req.headers.host}/api/users/confirmation/${user.email}/${user.verifyToken}  \n\nThank You!\n`;
  try {
    const message = {
      to: user.email,
      from: process.env.FROM_EMAIL_NEW,
      subject: 'Verification',
      text: msg,
    };
    await sendEmail(message);
    res.status(200).json({ success: true, msg: 'Email sent.' });
  } catch (err) {
    console.log(err);
    user.verifyToken = undefined;
    await user.save();
    res.status(500).json({
      success: false,
      msg: 'Technical Issue!, Please click on resend to verify your Email.',
    });
  }
});

// @route     POST api/users/forgotpassword
// @desc      Forgot Password
// @access    Public
router.post('/forgotpassword', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: 'There is no user with that email' });
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    //Create reset url
    const resetUrl = `http://localhost:5000/api/users/resetpassword/${resetToken}`;

    const msg = `You are recieving this email because you (or someone else) has requested the reset of password. Please click on the link ${resetToken}`;

    try {
      const message = {
        to: user.email,
        from: process.env.FROM_EMAIL_NEW,
        subject: 'Reset Password.',
        text: msg,
      };
      await sendEmail(message);
      return res
        .status(200)
        .json({ success: true, msg: 'Email sent for password reset' });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res
        .status(500)
        .json({ success: false, msg: 'Email could not be sent' });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, msg: 'Server Error.' });
  }
});

// @route     PUT api/users/resetpassword/:resettoken
// @desc      Reset Password
// @access    Public
router.post(
  '/resetpassword/:resettoken',
  [check('password', 'Please enter a new password.').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      // const resetPasswordToken = crypto
      //   .createHash("sha256")
      //   .update(req.params.resettoken)
      //   .digest("hex");
      // console.log(resetPasswordToken);
      // console.log(req.params);
      // console.log(req.params.resettoken);
      const resetPasswordToken = req.params.resettoken;
      // console.log(resetPasswordToken);
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ success: false, msg: 'Invalid Token' });
      }
      //set new password
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(200).json({ success: true, msg: 'Reset Password done' });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ success: false, msg: 'Server Error.' });
    }
  }
);

module.exports = router;
