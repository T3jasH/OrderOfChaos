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
        check('regno', 'Please enter your registration number.')
            .not()
            .isEmpty(),
        check('username', 'Please enter a username.').not().isEmpty(),
        check('college', 'Please enter a college name.').not().isEmpty(),
        check('phoneNo', 'Place enter you phone number').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ success: false, msg: errors.array()[0].msg });
        }

        const { name, email, password, regno, username, college, phoneNo } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res
                    .status(400)
                    .json({ success: false, msg: 'User already exists.' });
            }

            user = await User.findOne({ username });

            if (user) {
                return res.status(400).json({
                    success: false,
                    msg: 'Please choose a different username.',
                });
            }

            user = new User({
                name,
                email,
                password,
                regno,
                username,
                college,
                phoneNo
            });
            //Initializing noOfAttempts
            // let totalQues = process.env.NO_OF_QUESTIONS;
            for (let i = 0; i < process.env.NO_OF_QUESTIONS; i++) {
                user.noOfAttempts.push({
                    isSolved: false,
                    isLocked: true,
                    quesId: i + 1,
                    attempts: 0,
                });
            }
            

            //Get verify token
            const verifyToken = user.getVerifiedToken();
            await user.save({ validateBeforeSave: false });
            const resp = 'https://mail.iecsemanipal.com/codeevent/verifyaccount';
            const resetUrl = `${req.protocol}://localhost:3000/confirmation/${user.verifyToken}`;
            try {
                await sendEmail(resp, user.email,user.name,resetUrl);
                res.status(200).json({ success: true, msg: 'Email Sent.' });
            } catch (err) {
                console.log(err);
                user.verifyToken = undefined;

                await user.save();
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ success: false, msg: 'Server Error' });
        }
    }
);

// @route     GET api/users/confirmation/:email/:token
// @desc      Email Verify Confirmation
// @access    Public
router.get('/confirmation/:token', async (req, res, next) => {
    const user = await User.findOne({ verifyToken: req.params.token });
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
            msg: 'User has already been verified. Continue to Login.',
        });
    } else {
        user.isVerified = true;
        await user.save(function (err) {
            if (err) {
                return res
                    .status(500)
                    .json({ success: false, msg: err.message });
            } else {
                return res.status(200).json({
                    success: true,
                    msg: 'Your account has successfully been verified.',
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
        return res.status(400).json({
            success: false,
            msg: 'Unable to find a user with that email.',
        });
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
    const resetUrl = `${req.protocol}://${req.get(
        'host'
    )}/api/users/confirmation/${user.verifyToken}`;
    const resp = 'https://mail.iecsemanipal.com/codeevent/verifyaccount';
    const msg = `Hello Participant \n\n Please verify your account by clicking the link: \n ${resetUrl} \n\nThank You!\n`;
    try {
        await sendEmail(resp, user.email, user.name, resetUrl);
        res.status(200).json({ success: true, msg: 'Email sent.' });
    } catch (err) {
        console.log(err);
        user.verifyToken = undefined;
        await user.save();
        res.status(500).json({
            success: false,
            msg:
                'Technical Issue!, Please click on resend to verify your Email.',
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
            return res.status(404).json({
                success: false,
                msg: 'There is no user with that email.',
            });
        }

        //Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        //Create reset url
        const resetUrl = `${req.protocol}://localhost:3000/resetpassword/${resetToken}`;

        const msg = `You are recieving this email because you (or someone else) has requested the reset of password. Please click on the link ${resetUrl}`;
        const resp = 'https://mail.iecsemanipal.com/codeevent/resetpassword';
        try {
            await sendEmail(resp, user.email,user.name,resetUrl);
            return res
                .status(200)
                .json({ success: true, msg: 'Email sent for password reset.' });
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                msg: 'Technical Issue!, Please click on forgot password again.',
            });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
});

// @route     GET api/users/resetpassword/:resettoken
// @desc      Reset Password Page
// @access    Public
router.get('/resetpassword/:resettoken', async (req, res) => {
    try {
        const resetPasswordToken = req.params.resettoken;
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid Token. Try forgot password again.',
            });
        }
        return res.json({
            success: true,
            msg: 'Correct Token',
            data: { resettoken: resetPasswordToken },
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
});

// @route     POST api/users/resetpassword/:resettoken
// @desc      Reset Password
// @access    Public
router.post(
    '/resetpassword/:resettoken',
    [check('password', 'Please enter a password of at least 8 characters.').isLength({min: 8})],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ success: false, msg : errors.array()[0].msg });
        }
        try {
            const resetPasswordToken = req.params.resettoken;
            const user = await User.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() },
            });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    msg: 'Invalid Token.Try forgot password again.',
                });
            }
            //set new password
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            res.status(200).json({
                success: true,
                msg: 'Reset Password successful.',
            });
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ success: false, msg: 'Server Error' });
        }
    }
);

module.exports = router;
