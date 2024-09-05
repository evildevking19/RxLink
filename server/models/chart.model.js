const { Schema, model } = require('./conn'); // import Schema & model
const { timeString, formatChartData } = require('../utils/common');
/**
 * Chart Schema
 */
var ChartScheme = new Schema({
  date: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true,
    default: 1
  },
  type: {
    type: String,
    required: true
  },
  created: {
    type: String,
    default: Date.now
  }
});

ChartScheme.statics.log = async function (type) {
  const date = timeString(Date.now());
  const old = await this.findOne({ type, date });
  if (old) {
    old.count = old.count + 1;
    await old.save();
  } else {
    await this.create({
      date,
      type
    });
  }
};

ChartScheme.statics.getChart = async function (type) {
  const now = Date.now();
  const from = now - 30 * 24 * 60 * 60 * 1000;
  const data = await this.find({ created: { $gte: from } });

  const patientObject = {};
  const prescriptionObject = {};
  const dispenseObject = {};

  for (let i = 0; i < 30; i++) {
    let time = timeString(now - i * 24 * 60 * 60 * 1000);
    patientObject[time] = 0;
    prescriptionObject[time] = 0;
    dispenseObject[time] = 0;
  }

  let patientMin = 0;
  let prescriptionMin = 0;
  let dispenseMin = 0;
  
  for (const record of data) {
    let value = record.count;
    let key = timeString(record.created);
    if (record.type == 'patient') {
      patientObject[key] = value;
      if (patientMin == 0 || patientMin > value) patientMin = value;
    }
    if (record.type == 'prescription') {
      prescriptionObject[key] = value;
      if (prescriptionMin == 0 || prescriptionMin > value) prescriptionMin = value;
    }
    if (record.type == 'dispense') {
      dispenseObject[key] = value;
      if (dispenseMin == 0 || dispenseMin > value) dispenseMin = value;
    }
  }
  
  const patient = Object.values(patientObject);
  const prescription = Object.values(prescriptionObject);
  const dispense = Object.values(dispenseObject);
  
  patient[29] = patientMin -1;
  prescription[29] = prescriptionMin -1;
  dispense[29] = dispenseMin -1;

  for (let i = 28; i >= 0; i--) {
    if (patient[i] == 0) patient[i] = patient[i + 1];
    if (prescription[i] == 0) prescription[i] = prescription[i + 1];
    if (dispense[i] == 0) dispense[i] = dispense[i + 1];
  }

  return {
    patient: patient.reverse(),
    prescription: prescription.reverse(),
    dispense: dispense.reverse()
  };
};

const Chart = model('Chart', ChartScheme);

module.exports = Chart;
