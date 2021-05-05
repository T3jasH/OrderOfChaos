const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");
const Question = require("../models/Question");
// @route     POST question
// @desc      Post question
// @access    Private to admin
router.post("/", isLoggedIn, isAdmin, async (req, res) => {
    console.log("inside add question");
    let newQuestion = new Question({
        quesId: req.body.quesId,
        name: req.body.name,
        points: req.body.points,
        tags: req.body.tags,
        statement: req.body.statement,
        constraints: req.body.constraints,
        inpFormat: req.body.inpFormat,
        outFormat: req.body.outFormat,
        samInput: req.body.samInput,
        samOutput: req.body.samOutput,
        testcase: req.body.testcase,
        answer: req.body.answer,
        unlockCost: req.body.unlockCost,
        penalty: req.body.penalty,
    });
    try {
        let ques = await newQuestion.save();
        res.json(ques);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;
