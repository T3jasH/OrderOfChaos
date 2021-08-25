const express = require("express")
const router = express.Router()
const isLoggedIn = require("../middleware/isLoggedIn")
const isRunning = require("../middleware/isRunning")
const isNotEnded = require("../middleware/isNotEnded")
const Question = require("../models/Question")
const User = require("../models/User")

// @route     GET api/question
// @desc      Get question
// @access    Private
// Response should contain question's data.

router.get("/:id", isLoggedIn, isRunning, async (req, res) => {
    try {
        let userid = req.user.id
        let user = await User.findOne({
            _id: userid,
        }).select("noOfAttempts")
        if (!user.noOfAttempts[req.params.id - 1].isLocked) {
            let selQues = await Question.findOne({
                quesId: req.params.id,
            }).select("-answer")
            let userQestionData = user.noOfAttempts.find(
                (q) => q.quesId == req.params.id
            )
            res.send({
                success: true,
                msg: "Question found and sent successfully.",
                data: {
                    question: selQues,
                    attempts: userQestionData.attempts,
                    isSolved: userQestionData.isSolved,
                },
            })
        } else {
            res.send({ success: false, msg: "Question is locked" })
        }
    } catch (err) {
        console.log(`Error : ${err.message}`)
        res.status(500).json({ success: false, msg: "Server Error" })
    }
})

// @route     POST api/question/:id
// @desc      Post output
// @access    Private
// Check the output and change score of the user as required.
// In response send success (boolean).
router.post("/:id", isLoggedIn, isRunning, isNotEnded, async (req, res) => {
    try {
        //TODO:compare IP before submitting
        //if first attempt and solved then attack given
        let selQues = await Question.findOne({
            quesId: req.params.id,
        })
        let userid = req.user.id
        let user = await User.findOne({
            _id: userid,
        })
        let sol = req.body.answer
        sol = sol.replace(/\r\n/gm, "\n")
        let pos = req.params.id - 1
        let actualPoints = selQues.points
        let deduction = selQues.penalty
        let attemptsTillNow = user.noOfAttempts[pos].attempts
        let difficulty = selQues.difficulty
        //if not solved then only shld be allowed to solve
        if (user.noOfAttempts[pos].isLocked)
            return res.status(400).json({
                success: false,
                msg: "Unlock the question first",
            })

        if (!user.noOfAttempts[pos].isSolved) {
            if (selQues.answer.replace(/\r\n/gm, "\n").trim() === sol.trim()) {
                //first attempt correct answer give power only if less than 4 stored attacks
                if (user.remAttack < 3) {
                    if (attemptsTillNow < difficulty) {
                        await User.updateOne(
                            {
                                _id: req.user.id,
                            },
                            {
                                $set: {
                                    remAttack: user.remAttack + 1,
                                    score: actualPoints + user.score,
                                    [`noOfAttempts.${pos}.isSolved`]: true,
                                    [`noOfAttempts.${pos}.attempts`]:
                                        user.noOfAttempts[pos].attempts + 1,
                                    lastCorrSub: new Date(),
                                },
                            }
                        )
                        res.json({
                            success: true,
                            msg: `Question solved and Attack added`,
                            attackAdded: true,
                        })
                        console.log(
                            `${user.username} (${user.name}) solved ${selQues.name} and got an attack.`
                        )
                    } else {
                        await User.updateOne(
                            {
                                _id: req.user.id,
                            },
                            {
                                $set: {
                                    score: actualPoints + user.score,
                                    [`noOfAttempts.${pos}.isSolved`]: true,
                                    [`noOfAttempts.${pos}.attempts`]:
                                        user.noOfAttempts[pos].attempts + 1,
                                    lastCorrSub: new Date(),
                                },
                            }
                        )

                        res.json({
                            success: true,
                            msg: `Question Solved.`,
                            attackAdded: false,
                        })
                        console.log(
                            `${user.username} (${user.name}) solved ${selQues.name}.`
                        )
                    }
                } else {
                    await User.updateOne(
                        {
                            _id: req.user.id,
                        },
                        {
                            $set: {
                                score: actualPoints + user.score,
                                [`noOfAttempts.${pos}.isSolved`]: true,
                                [`noOfAttempts.${pos}.attempts`]:
                                    user.noOfAttempts[pos].attempts + 1,
                                lastCorrSub: new Date(),
                            },
                        }
                    )

                    res.json({
                        success: true,
                        msg: "Question Solved. Maximum attack reached.",
                        attackAdded: false,
                    })
                }
                if (!user.isAdmin) {
                    await Question.updateOne(
                        { quesId: selQues.quesId },
                        { $set: { solved: selQues.solved + 1 } }
                    )
                }
            } else {
                await User.updateOne(
                    {
                        _id: req.user.id,
                    },
                    {
                        $set: {
                            [`noOfAttempts.${pos}.attempts`]:
                                attemptsTillNow + 1,
                            score: user.score - deduction,
                        },
                    }
                )
                return res.status(400).json({
                    success: false,
                    msg: "Wrong answer.",
                })
            }
        } else {
            return res.json({ success: false, msg: "Already solved." })
        }
    } catch (err) {
        console.log(`Error : ${err.message}`)
        res.status(500).json({ success: false, msg: "Server Error" })
    }
})

router.get(
    "/locked/:id",
    isLoggedIn,
    isRunning,
    isNotEnded,
    async (req, res) => {
        try {
            let userid = req.user.id
            // console.log(userid);
            let user = await User.findOne({
                _id: userid,
            })
            let pos = req.params.id - 1
            let selQues = await Question.findOne({
                quesId: req.params.id,
            })
            if (!user.isActive) {
                await User.updateOne(
                    {
                        _id: req.user.id,
                    },
                    {
                        $set: {
                            isActive: true,
                            ipaddress: req.ipInfo.ip,
                        },
                    }
                )
            }
            if (user.score >= selQues.unlockCost) {
                let locked = user.noOfAttempts[pos].isLocked
                if (locked) {
                    await User.updateOne(
                        {
                            _id: req.user.id,
                        },
                        {
                            $set: {
                                [`noOfAttempts.${pos}.isLocked`]: false,
                                score: user.score - selQues.unlockCost,
                            },
                        }
                    )
                    res.send({ success: true, msg: "Unlocking the question" })
                    console.log(
                        `${user.username} (${user.name}) unlocked ${selQues.name}.`
                    )
                } else {
                    res.send({
                        success: false,
                        msg: "Question is already unlocked",
                    })
                }
            } else {
                res.send({
                    sucess: false,
                    msg: "Less points cannot unlock this question.",
                })
            }
        } catch (err) {
            console.log(`Error : ${err.message}`)
            res.status(500).json({ success: false, msg: "Server Error" })
        }
    }
)

module.exports = router
