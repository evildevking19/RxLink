const { Schema, model } = require("./conn"); // import Schema & model

/**
 * Practice Schema
 */
var PracticeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  credit: {
    type: Number,
    default: 0
  },
  created: {
    type: String,
    default: Date.now,
  },
});

PracticeSchema.pre("find", function () {
  this.sort({ created: -1 });
});

PracticeSchema.pre("save", async function () {
  this.fullname = this.firstname + ' ' + this.lastname;
});

// Practice model
const Practice = model("Practice", PracticeSchema);

module.exports = Practice;
