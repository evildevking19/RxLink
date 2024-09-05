const { Schema, model } = require("./conn"); // import Schema & model
// Require mongoose-find-by-reference
const { MongooseFindByReference } = require('mongoose-find-by-reference');
/**
 * Prescription Schema
 */
var PrescriptionSchema = new Schema({
  rid: {
    type: String,
    unique: true,
    required: true
  },
  doctor: {
    type: Schema.Types.ObjectId, required: true, ref: 'Doctor'
  },
  pharmacy: {
    type: Schema.Types.ObjectId, ref: 'Pharmacy', default: null
  },
  patient: {
    type: Schema.Types.ObjectId, required: true, ref: 'Patient'
  },
  drugs: {
    type: Array
  },
  status: {
    type: Boolean,
    default: false
  },
  dispense: {
    type: Boolean,
    default: false
  },
  pdf: {
    type: String,
  },
  hash: {
    type: String
  },
  created: {
    type: String,
    default: Date.now,
  },
});

PrescriptionSchema.plugin(MongooseFindByReference);

PrescriptionSchema.pre("find", function () {
  this.sort({ created: -1 });
});

const Prescription = model("Prescription", PrescriptionSchema);

module.exports = Prescription;
