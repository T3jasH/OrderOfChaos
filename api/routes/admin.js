const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin = require('../middleware/isAdmin');
const Question = require('../models/Question');

// @route     POST question
// @desc      Post question
// @access    Private to admin
router.post('/', isLoggedIn, isAdmin, async (req, res) => {
    // console.log('inside add question');

    // console.log(req.body);
    let points, unlockCost, penalty;
    switch (req.body.difficulty) {
        case "1":
            points = process.env.POINTS_EASY;
            unlockCost = process.env.UNLOCK_EASY;
            penalty = process.env.PENALTY_EASY;
            break;
        case "2":
            points = process.env.POINTS_MED;
            unlockCost = process.env.UNLOCK_MED;
            penalty = process.env.PENALTY_MED;
            break;
        case "3":
            points = process.env.POINTS_HARD;
            unlockCost = process.env.UNLOCK_HARD;
            penalty = process.env.PENALTY_HARD;
            break;
    }

    const newQuestion = new Question({
        quesId: req.body.quesId,
        name: req.body.name,
        statement: req.body.statement,
        constraints: req.body.constraints,
        inpFormat: req.body.inpFormat,
        outFormat: req.body.outFormat,
        samInput: req.body.samInput,
        samOutput: req.body.samOutput,
        testcase: req.body.testcase,
        answer: req.body.answer,
        difficulty: req.body.difficulty,
        unlockCost: unlockCost,
        penalty: penalty,
        points: points,
    });
    try {
        await newQuestion.save();
        res.json({
            success: true,
            msg: 'Question submitted successfully.',
        });
    } catch (err) {
        console.log(`Error : ${err.message}`);
        res.status(500).json({ success: false, msg: "Server Error" });
    }
});

module.exports = router;
