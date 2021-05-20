const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    regno: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    college: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        //required: true
    },
    score: {
        type: Number,
        default: 200,
    },
    remAttack: {
        type: Number,
        default: 0,
        max: 3,
    },
    attackers: [
        {
            username: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
            seen: {
                type: Boolean,
                default: false,
            },
        },
    ],
    noOfAttempts: [
        {
            //initialised when user registers
            quesId: {
                type: Number,
                required: true,
            },
            attempts: {
                type: Number,
                default: 0,
            },
            isSolved: {
                type: Boolean,
                default: false,
            },
            isLocked: {
                type: Boolean,
                default: true,
            },
        },
    ],
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    lastCorrSub: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    ipaddress: {
        type: String,
    },
    verifyToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Generate and hash verify Token
UserSchema.methods.getVerifiedToken = function () {
    //Generate token
    const verifyToken = crypto.randomBytes(20).toString("hex");

    //Hash token and set to resetPasswordToken field
    this.verifyToken = crypto
        .createHash("sha256")
        .update(verifyToken)
        .digest("hex");

    return verifyToken;
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
    //Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    //Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return this.resetPasswordToken;
};

module.exports = mongoose.model("user", UserSchema);
