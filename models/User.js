const mongoose = require('mongoose');

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
  score: {
    type: Number,
    default: 200,
  },
  remAttack: {
    type: Number,
    default: 0,
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
      quesId: {
        type: Number,
        required: true,
      },
      attempts: {
        type: Number,
        default: -1,
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
});

module.exports = mongoose.model('user', UserSchema);
