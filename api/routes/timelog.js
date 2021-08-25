const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const isRunning = require('../middleware/isRunning');
const User = require('../models/User');

router.post('/', isLoggedIn, isRunning, async (req, res) => {
    try {
        let userid = req.user.id;
        let user = await User.findOne({
            _id: userid,
        });
        for(let i=0; i<user.attackers.length; i++)
        {
            user.attackers[i].seen = true;
        }
        await user.save();
        return res.json({ success: true, msg: 'Sucessfully Seen' });
    } catch (e) {
        console.log(`Error : ${e.message}`)
        return res.status(500).json({ success: false, msg: 'Server Error' });
    }
});

module.exports = router;
