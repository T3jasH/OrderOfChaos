const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const isRunning = require("../middleware/isRunning");

// @route     GET api/leaderboard
// @desc      Get leaderboard
// @access    Private
// Response should contain all active users.
router.get("/", isLoggedIn, (req, res) => {
    res.send("Get leaderboard.");
});

// @route     POST api/leaderboard/:id
// @desc      Attack a player
// @access    Private
// Check if the user has an attack if yes then complete attack.
// In response send success (boolean).
router.post("/:id", isLoggedIn, isRunning, (req, res) => {
    res.send("Attack other player.");
});

module.exports = router;
