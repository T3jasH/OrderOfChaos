const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const isRunning = require('../middleware/isRunning');

// @route     GET api/question/:id
// @desc      Get question
// @access    Private
// Response should contain question's data.
router.get('/', isLoggedIn, isRunning, (req, res) => {
  res.send('Get question id.');
});

// @route     POST api/question/:id
// @desc      Post output
// @access    Private
// Check the output and change score of the user as required.
// In response send success (boolean).
router.post('/', isLoggedIn, isRunning, (req, res) => {
  res.send('Post output.');
});

module.exports = router;
