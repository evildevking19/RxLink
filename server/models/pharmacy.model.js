const { Schema, model } = require("./conn"); // import Schema & model
/**
 * Pharmacy Schema
 */
var PharmacyScheme = new Schema({
  ods_code: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: ''
  },
  trading_name: {
    type: String,
    default: ''
  },
  address1: {
    type: String,
    default: ''
  },
  address2: {
    type: String,
    default: ''
  },
  address3: {
    type: String,
    default: ''
  },
  address4: {
    type: String,
    default: ''
  },
  post_code: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ''
  },
  created: {
    type: String,
    default: Date.now,
  },
});

PharmacyScheme.pre("find", function () {
  this.sort({ created: -1 });
});

const Pharmacy = model("Pharmacy", PharmacyScheme);

module.exports = Pharmacy;
