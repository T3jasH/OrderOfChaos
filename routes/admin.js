const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin = require('../middleware/isAdmin');

// @route     POST question
// @desc      Post question
// @access    Private to admin
router.post('/', isLoggedIn, isAdmin, (req, res) => {
  res.send('Post question.');
});

module.exports = router;
