const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const isRunning = require('../middleware/isRunning');
const User = require('../models/User');
const Question = require('../models/Question');
// @route     GET api/contest
// @desc      Get questions
// @access    Private
// Response should contain user data (except password) and an array of question objects.
const getContest = async (req, res) => {
    try {
        let userid = req.user.id;
        let user = await User.findOne({ _id: userid }).select('-password');
        let ques = await Question.find({})
            .select('quesId name points tags unlockCost penalty solved difficulty')
            .sort({ quesId: 1 });

        // console.log(ques);

        let quesIdToQues = new Map();
        for (let i = 0; i < ques.length; i++) {
            quesIdToQues.set(ques[i].quesId, ques[i]);
        }
        let quesUser = [];
        for (let i = 0; i < user.noOfAttempts.length; i++) {
            if (quesIdToQues.has(user.noOfAttempts[i].quesId)) {
                quesUser.push({
                    isSolved: user.noOfAttempts[i].isSolved,
                    isLocked: user.noOfAttempts[i].isLocked,
                    attempts: user.noOfAttempts[i].attempts,
                    tags: quesIdToQues.get(user.noOfAttempts[i].quesId).tags,
                    quesId: quesIdToQues.get(user.noOfAttempts[i].quesId)
                        .quesId,
                    name: quesIdToQues.get(user.noOfAttempts[i].quesId).name,
                    points: quesIdToQues.get(user.noOfAttempts[i].quesId)
                        .points,
                    unlockCost: quesIdToQues.get(user.noOfAttempts[i].quesId)
                        .unlockCost,
                    penalty: quesIdToQues.get(user.noOfAttempts[i].quesId)
                        .penalty,
                    solved: quesIdToQues.get(user.noOfAttempts[i].quesId).solved,
                    difficulty: quesIdToQues.get(user.noOfAttempts[i].quesId).difficulty
                });
            }
        }

        let resp = {
            questions: quesUser,
            user : user,
            isStarted : process.env.isRunning == 1 || user.isAdmin ? true : false,
            isEnded: process.env.isEnded == 1 ? true : false 
        };
        // console.log(resp);
        res.send({
            success: true,
            msg: 'Contest info mapped to user and sent successfully',
            data: resp,
        });
    } catch (err) {
        console.log(`Error : ${err.message}`);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

//--------------All Routes to be placed in one index.js under routes------------------------------------------
router.get('/', isLoggedIn, isRunning, getContest);

module.exports = router;
