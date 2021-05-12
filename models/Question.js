const mongoose = require("mongoose");

const QuestionSchema = mongoose.Schema({
    quesId: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
    statement: {
        type: String,
        required: true,
    },
    constraints: {
        type: String,
        required: true,
    },
    inpFormat: {
        type: String,
        required: true,
    },
    outFormat: {
        type: String,
        required: true,
    },
    samInput: {
        type: String,
        required: true,
    },
    samOutput: {
        type: String,
        required: true,
    },
    testcase: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    unlockCost: {
        type: Number,
        required: true,
    },
    penalty: {
        type: Number,
        required: true,
    },
    difficulty:{
        type:Number,
        enum:[1,2,3],
        required:true
    },
    solved:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model("question", QuestionSchema);
