const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const isRunning = require('../middleware/isRunning');
const Question = require('../models/Question')
const User = require('../models/User')

// @route     GET api/question
// @desc      Get question
// @access    Private
// Response should contain question's data.

router.get('/:id', isLoggedIn, isRunning, async (req, res) => {
    let selQues = await Question.findOne({
        quesId: req.params.id
    })
    res.send(selQues);
});

// @route     POST api/question/:id
// @desc      Post output
// @access    Private
// Check the output and change score of the user as required.
// In response send success (boolean).

router.post('/:id', isLoggedIn, isRunning, async (req, res) => {

    //if first attempt and solved then attack given
    let selQues = await Question.findOne({
        quesId: req.params.id
    });
    let answer = req.body.answer;
    let userid = req.user.id
    let user = await User.findOne({
        _id: userid
    })
    let pos = req.params.id - 1
    let actualPoints = selQues.points
    let deduction = selQues.penalty
    let attemptsTillNow = user.noOfAttempts[pos].attempts
    //if not solved
    if (!user.noOfAttempts[pos].isSolved) {
        if (answer == selQues.answer) {
            //first attempt correct answer
            if (attemptsTillNow == 0) {
                await User.updateOne({
                    "_id": req.user.id
                }, {
                    $set: {
                        "remAttack": user.remAttack + 1
                    }
                });
            }
            //correct answer in general
            let currScore = (actualPoints) - (actualPoints * deduction * 0.01 * attemptsTillNow);
            await User.updateOne({
                "_id": req.user.id
            }, {
                $set: {
                    "score": currScore + user.score,
                    [`noOfAttempts.${pos}.isSolved`]: true
                }

            });
            console.log("Gg!");
        } else {
            //WA
            await User.updateOne({
                "_id": req.user.id
            }, {
                $set: {
                    [`noOfAttempts.${pos}.attempts`]: attemptsTillNow + 1
                }
            });
        }
        console.log("currscore=" + currScore);
        console.log("remattack=" + user.remAttack);
        console.log("actual=" + actualPoints);
        console.log("penalty=" + deduction + "%");
        console.log("attempts=" + (attemptsTillNow + 1));
        res.send('Post output.');
    } else {
        res.send("already solved")
    }
});

router.get('/locked/:id', isLoggedIn, isRunning, async(req, res) => {
    res.send("hi")
    let userid = req.user.id
    console.log(userid);
    let user = await User.findOne({
        _id: userid
    })
    let pos = req.params.id - 1
    let selQues = await Question.findOne({
        quesId: req.params.id
    });
    // if (user.score > selQues.unlockCost) {
    //     // console.log(user.score+">"+selQues.unlockCost);
    //     let locked=user.noOfAttempts[req.params.id - 1].isLocked;
    //     console.log(locked);
    //     console.log();
    //     if (0) {
    //         // await User.updateOne({
    //         //     "_id": req.user.id
    //         // }, {
    //         //     $set: {
    //         //         [`noOfAttempts.${pos}.isLocked`]: false,
    //         //         score: user.score - selQues.unlockCost
    //         //     }
    //         // });
    //         res.send("unlocking the question")
    //     } else {
    //         res.send("question is already unlocked")
    //     }
    // } else {
    //     res.send("Less points cannot unlock this question")
    // }
});


module.exports = router;