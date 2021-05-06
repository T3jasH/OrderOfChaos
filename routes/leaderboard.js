const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const isRunning = require('../middleware/isRunning');
const User = require('../models/User');

//To get Leaderboard
const getLeaderboard = async (req, res) => {
    mycomp = (a, b) => {
        if (a.score < b.score) return 1;
        else if (a.score > b.score) return -1;
        else if (a.lastCorrSub < b.lastCorrSub) return -1;
        else if (a.lastCorrSub > b.lastCorrSub) return 1;
        else return 0;
    };
    let ranks = [];
    try {
        ranks = await User.find({
            isActive: true,
        }).select('-password');
        ranks.sort(mycomp);
        console.log(ranks);
        res.send({ success: true, msg: 'Latest leaderboard fetched', ranks });
    } catch (err) {
        console.log(err);
        res.send({ success: false, msg: "Couldn't fetch latest leaderboard" });
    }
};

//Attack power implemented
const attackUser = async (req, res) => {
    console.log(req.user);
    let attackerid = req.user.id;
    let attacker = await User.findOne({ _id: attackerid }).select('-password');
    let id = req.params.id;
    console.log(id);
    if (attacker.remAttack > 0) {
        let user = await User.findOne({ _id: id }).select('-password');
        if (user) {
            console.log(
                'Attack left on player under attack ' + user.attackers.length
            );
            if (user.attackers.length < 15) {
                user.score = user.score - 20;

                console.log('Attacker is ' + attacker);
                user.attackers.push({
                    username: attacker.username,
                    date: Date.now(),
                    seen: false,
                });
                user.save();
                attacker.remAttack = attacker.remAttack - 1;
                attacker.save();
                console.log('Attack was successful');
                res.send({ success: true, msg: 'Attack was successful' });
            } else {
                console.log('Attack limit reached');
                res.send({
                    success: false,
                    msg:
                        'Cannot attack the player as player has already reached max attacks,try attacking other player',
                });
            }
        } else {
            console.log('Player under attack not found');
            res.send({ success: false, msg: 'Attack other player.' });
        }
    } else {
        console.log('Attacker has insufficient attacks');
        res.send({
            success: false,
            msg:
                'You dont have attacks left,try solving question on first attempt to get attacks',
        });
    }
};

//--------------All Routes to be placed in one index.js under routes------------------------------------------

// @route     GET api/leaderboard
// @desc      Get leaderboard
// @access    Private
// Response should contain all active users.
router.get('/', isLoggedIn, getLeaderboard);

// @route     POST api/leaderboard/:id
// @desc      Attack a player
// @access    Private
// Check if the user has an attack if yes then complete attack.
// In response send success (boolean).
router.post('/:id', isLoggedIn, isRunning, attackUser);

module.exports = router;
