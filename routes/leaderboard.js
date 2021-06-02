const express = require("express")
const router = express.Router()
const isLoggedIn = require("../middleware/isLoggedIn")
const isRunning = require("../middleware/isRunning")
const isNotEnded = require("../middleware/isNotEnded")
const User = require("../models/User")

//To get Leaderboard
const getLeaderboard = async (req, res) => {
    try {
        mycomp = (a, b) => {
            if (a.score < b.score) return 1
            else if (a.score > b.score) return -1
            else if (a.lastCorrSub < b.lastCorrSub) return -1
            else if (a.lastCorrSub > b.lastCorrSub) return 1
            else return 0
        }
        let ranks = []
        try {
            ranks = await User.find({
                isActive: true,
                isAdmin: false,
            }).select("username score attackers")
            ranks.sort(mycomp)
            var attackers = ranks.map((obj) => obj.attackers)
            res.send({
                success: true,
                msg: "Latest leaderboard fetched",
                data: { ranks: ranks, attackers: attackers },
            })
        } catch (err) {
            console.log(`Error : ${err.message}`)
            res.send({
                success: false,
                msg: "Couldn't fetch latest leaderboard",
            })
        }
    } catch (err) {
        console.log(`Error : ${err.message}`)
        res.status(500).json({ success: false, msg: "Server Error" })
    }
}

//Attack power implemented
const attackUser = async (req, res) => {
    try {
        // console.log(req.user);
        let attackerid = req.user.id
        let attacker = await User.findOne({ _id: attackerid }).select(
            "-password"
        )
        let id = req.params.id
        if (attackerid === id)
            return res.json({
                success: false,
                msg: "You cannot attack yourself",
            })
        // console.log(id);
        if (attacker.remAttack > 0) {
            let user = await User.findOne({ _id: id }).select("-password")
            if (user) {
                // console.log(
                //     'Attack left on player under attack ' +
                //         user.attackers.length
                // );
                if (user.attackers.length < parseInt(process.env.MAX_ATTACKS)) {
                    user.score =
                        user.score - parseInt(process.env.ATTACK_PENALTY)

                    // console.log('Attacker is ' + attacker);
                    user.attackers.push({
                        username: attacker.username,
                        date: Date.now(),
                        seen: false,
                    })
                    await user.save()
                    attacker.remAttack = attacker.remAttack - 1
                    await attacker.save()
                    console.log(
                        `${attacker.username} (${attacker.name}) attacked ${user.username} (${user.name}).`
                    )
                    return res.send({
                        success: true,
                        msg: "Attack was successful",
                    })
                } else {
                    // console.log('Attack limit reached');
                    return res.send({
                        success: false,
                        msg: "Player has been attacked 15 times",
                    })
                }
            } else {
                // console.log('Player under attack not found');
                return res.send({
                    success: false,
                    msg: "Player you want to attack was not found",
                })
            }
        } else {
            // console.log('Attacker has insufficient attacks');
            return res.send({
                success: false,
                msg:
                    "You dont have attacks left,try solving question on first attempt to get attacks",
            })
        }
    } catch (err) {
        console.log(`Error : ${err.message}`)
        res.status(500).json({ success: false, msg: "Server Error" })
    }
}

//--------------All Routes to be placed in one index.js under routes------------------------------------------

// @route     GET api/leaderboard
// @desc      Get leaderboard
// @access    Private
// Response should contain all active users.
router.get("/", isLoggedIn, getLeaderboard)

// @route     POST api/leaderboard/:id
// @desc      Attack a player
// @access    Private
// Check if the user has an attack if yes then complete attack.
// In response send success (boolean).
router.post("/:id", isLoggedIn, isRunning, isNotEnded, attackUser)

module.exports = router
