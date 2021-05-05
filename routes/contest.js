const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const isRunning = require("../middleware/isRunning");

// @route     GET api/contest
// @desc      Get questions
// @access    Private
// Response should contain user data (except password) and an array of question objects.
router.get("/", isLoggedIn, isRunning, (req, res) => {
    res.send("Get questions.");
});

module.exports = router;
