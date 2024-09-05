const { Schema, model } = require("./conn"); // import Schema & model
/**
 * Transaction Schema
 */
var TransactionScheme = new Schema({
  payer: {
    type: Schema.Types.ObjectId, required: true, ref: 'Doctor'
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  created: {
    type: String,
    default: Date.now,
  },
});

TransactionScheme.pre("find", function () {
  this.sort({ created: -1 });
});

const Transaction = model("Transaction", TransactionScheme);

module.exports = Transaction;
