const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isLoggedIn = require("../middleware/isLoggedIn");

// @route     GET api/auth
// @desc      Get logged in user
// @access    Private
router.get("/", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json({ success: true, msg: "User found", data: { 
            user: user,
            isStarted: process.env.isRunning == 1 || user.isAdmin ? true : false, 
            isEnded: process.env.isEnded == 1 ? true : false 
        } });
    } catch (err) {
        console.log(`Error : ${err.message}`);
        res.status(500).json({ success: false, msg: "Server Error." });
    }
});

// @route     POST api/auth
// @desc      Auth user and get token
// @access    Public
router.post(
    "/",
    [
        check("email", "Please enter a valid email address.").isEmail(),
        check("password", "Incorrect Password").isLength({min: 8}),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res
                    .status(400)
                    .json({ success: false, msg: "User is not registered." });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ success: false, msg: "Incorrect Password" });
            }

            //check user is verified or not
            if (!user.isVerified) {
                return res.status(401).send({
                    msg:
                        "Your Email has not been verified. Please click on resend.",
                });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "720h",
            });

            res.json({
                success: true,
                msg: "User successfully logged in!",
                data: { 
                    token: token,
                    isStarted: process.env.isRunning == 1 || user.isAdmin ? true : false
                },
            });
        } catch (err) {
            console.log(`Error : ${err.message}`);
            res.status(500).json({ success: false, msg: "Server Error" });
        }
    }
);

module.exports = router;
