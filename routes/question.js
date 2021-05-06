const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const isRunning = require("../middleware/isRunning");
const isIpValid = require("../middleware/isIpValid");
const Question = require("../models/Question");
const User = require("../models/User");

// @route     GET api/question
// @desc      Get question
// @access    Private
// Response should contain question's data.

router.get("/:id", isLoggedIn, isRunning, async (req, res) => {
    let selQues = await Question.findOne({
        quesId: req.params.id,
    });
    res.send(selQues);
});

// @route     POST api/question/:id
// @desc      Post output
// @access    Private
// Check the output and change score of the user as required.
// In response send success (boolean).

router.post("/:id", isLoggedIn, isRunning, isIpValid, async (req, res) => {
    //if first attempt and solved then attack given
    let selQues = await Question.findOne({
        quesId: req.params.id,
    });
    let answer = req.body.answer;
    let userid = req.user.id;
    let user = await User.findOne({
        _id: userid,
    });
    let pos = req.params.id - 1;
    let actualPoints = selQues.points;
    let deduction = selQues.penalty;
    let attemptsTillNow = user.noOfAttempts[pos].attempts;
    //if not solved then only shld be allowed to solve
    //TODO:check if IP is matching
    if (!user.noOfAttempts[pos].isSolved) {
        if (answer == selQues.answer) {
            //first attempt correct answer give power only if less than 4 stored attacks
            if (user.remAttack <= 3) {
                if (attemptsTillNow == 0) {
                    await User.updateOne(
                        {
                            _id: req.user.id,
                        },
                        {
                            $set: {
                                remAttack: user.remAttack + 1,
                            },
                        }
                    );
                }
                res.send({
                    success: true,
                    msg: `You have ${user.remAttack} attacks left`,
                });
            } else {
                res.send({
                    success: false,
                    msg: "At max 3 attacks can be stored",
                });
            }
            //correct answer in general
            let currScore =
                actualPoints -
                actualPoints * deduction * 0.01 * attemptsTillNow;
            await User.updateOne(
                {
                    _id: req.user.id,
                },
                {
                    $set: {
                        score: currScore + user.score,
                        [`noOfAttempts.${pos}.isSolved`]: true,
                    },
                }
            );
            lastCorrSub: new Date();
            res.send({ success: true, msg: "Solved successfully!" });
        } else {
            //WA
            await User.updateOne(
                {
                    _id: req.user.id,
                },
                {
                    $set: {
                        [`noOfAttempts.${pos}.attempts`]: attemptsTillNow + 1,
                    },
                }
            );
            res.send({ success: false, msg: "Unsuccessful attempt" });
        }
        // console.log("currscore=" + currScore);
        // console.log("remattack=" + user.remAttack);
        // console.log("actual=" + actualPoints);
        // console.log("penalty=" + deduction + "%");
        // console.log("attempts=" + (attemptsTillNow + 1));
    } else {
        //dont allow to click submit button ideally
        res.send({ success: false, msg: "Already solved" });
    }
});

//ip in backend
// When user unlocks first question, along with marking isActive, you need take ip.
//Then for every submission, check if it's same ip.
router.get("/locked/:id", isLoggedIn, isRunning, async (req, res) => {
    let userid = req.user.id;
    // console.log(userid);
    let user = await User.findOne({
        _id: userid,
    });
    let pos = req.params.id - 1;
    let selQues = await Question.findOne({
        quesId: req.params.id,
    });
    if (!user.isActive) {
        //TODO: take ip
        await User.updateOne(
            {
                _id: req.user.id,
            },
            {
                $set: {
                    isActive: true,
                },
            }
        );
    } else {
        if (user.score > selQues.unlockCost) {
            // console.log(user.score + ">" + selQues.unlockCost);
            let locked = user.noOfAttempts[pos].isLocked;
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
                );
                //redirect to api/question/:id (GET)
                res.send({ success: true, msg: "unlocking the question" });
            } else {
                res.send({
                    success: false,
                    msg: "question is already unlocked",
                });
            }
        } else {
            res.send({
                sucess: false,
                msg: "Less points cannot unlock this question",
            });
        }
    }
});

module.exports = router;
