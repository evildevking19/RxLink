const { Schema, model } = require("./conn"); // import Schema & model

/**
 * User Schema
 */
var UserSchema = new Schema({
  avatar: {
    type: String,
    default: null
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  fullname: {
    type: String
  },
  phone: {
    type: String,
    default: ""
  },
  practice: {
    type: String,
    default: ""
  },
  gmc: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    trim: true
  },
  role: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
    default: 0
  },
  verifyCount: {
    type: Number,
    default: 0
  },
  signinCode: {
    type: Number,
  }, 
  signinAttempt: {
    type: Number,
    default: 0
  },
  signinAttemptTime: {
    type: String,
    default: Date.now,
  },
  created: {
    type: String,
    default: Date.now,
  },
});

UserSchema.pre("find", function () {
  this.sort({ created: -1 });
});

UserSchema.pre("save", async function () {
  this.fullname = this.firstname + ' ' + this.lastname;
});

// User model
const User = model("Doctor", UserSchema);

module.exports = User;
