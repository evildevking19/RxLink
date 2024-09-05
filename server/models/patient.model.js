const { Schema, model } = require("./conn"); // import Schema & model

/**
 * Patient Schema
 */
var PatientSchema = new Schema({
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
  birthday: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  nhs: {
    type: String,
    trim: true,
    required: true
  },
  belongsTo: {
    type: String,
    trim: true,
    required: true
  },
  created: {
    type: String,
    default: Date.now,
  },
});

PatientSchema.pre("find", function () {
  this.sort({ created: -1 });
});

PatientSchema.pre("save", async function () {
  this.fullname = this.firstname + ' ' + this.lastname;
});

// Patient model
const Patient = model("Patient", PatientSchema);

module.exports = Patient;
