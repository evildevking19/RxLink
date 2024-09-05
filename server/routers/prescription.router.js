const { Router } = require('express'); // import router from express
const fs = require('fs');
const router = Router();

const PatientModel = require('../models/patient.model');
const PharmacyModel = require('../models/pharmacy.model');
const PrescriptionModel = require('../models/prescription.model');
const PracticeModel = require('../models/practice.model');
const ChartModel = require('../models/chart.model');
const utils = require('../utils/common.js');
const { genQRCode, createPdf, genSmsMessage } = require('../utils/media.js');
const { sendSms, sendWhatsapp, sendTemplateEmail } = require('../utils/twilio.js');

// get the list of prescriptions
router.get('/list', async (req, res) => {
  const { search, filters, page, count } = req.query;
  try {
    const conditions = [];
    let where = {};
    if (search) {
      for (const filter of filters) {
        conditions.push({
          [filter]: { $regex: '.*' + search + '.*' }
        });
      }
      where = { $or: conditions };
    }
    let total = await PrescriptionModel.countDocuments({ $and: [{ doctor: req.user.uid }, where] });
    let list = await PrescriptionModel.find({ $and: [{ doctor: req.user.uid }, where] })
      .skip((page - 1) * count)
      .limit(count)
      .populate('patient')
      .populate('pharmacy');

    res.json({ total, list });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// get detail of prescription by id
router.get('/detail/:id', async (req, res) => {
  const id = req.query.id;
  try {
    let detail = await PrescriptionModel.findById(id);
    if (detail) {
      res.json({ status: 'success', detail });
    } else {
      res.json({ error: 'Invalid data' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// get detail of prescription by id
router.post('/save', async (req, res) => {
  const { patient, pharmacy, drugs, id } = req.body;
  try {
    if (id) {
      // update
      let detail = await PrescriptionModel.findById(id);
      detail.patient = patient;
      detail.pharmacy = pharmacy;
      detail.drugs = drugs;
      await detail.save();
      res.json({ status: 'success', detail });
    } else {
      // add
      let rid = utils.genRID();
      let detail = await PrescriptionModel.create({ rid, patient, pharmacy, drugs, doctor: req.user.uid });

      // log for statistics
      await ChartModel.log('prescription');

      res.json({ status: 'success', detail });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// delete prescription by id
router.post('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await PrescriptionModel.findByIdAndRemove(id);
    res.json({ status: 'success' });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// send prescription by id
router.post('/send', async (req, res) => {
  const { id } = req.body;
  const host = req.protocol + '://' + req.headers.host;
  try {
    // check credit before send
    const practice = await PracticeModel.findOne({ name: req.user.practice });
    if (practice.credit < 1) {
      return res.json({
        status: 'failed',
        error: 'Insufficient credit, please top up!'
      });
    } else {
      practice.credit = practice.credit - 1;
      practice.save();
    }

    // send the prescription
    let prescription = await PrescriptionModel.findById(id).populate('doctor').populate('patient').populate('pharmacy');

    const qrcode = await genQRCode(host + '/verify/' + prescription.rid + '/' + prescription.patient.birthday);

    const options = {
      rid: prescription.rid,
      qrcode,
      host,
      doctorName: prescription.doctor.fullname,
      doctorEmail: prescription.doctor.email,
      doctorPhone: prescription.doctor.phone,
      doctorGMC: prescription.doctor.gmc,
      doctorPractice: prescription.doctor.practice,
      patientName: prescription.patient.fullname,
      patientEmail: prescription.patient.email,
      patientBirthday: prescription.patient.birthday,
      patientPhone: prescription.patient.phone,
      patientNHS: prescription.patient.nhs,
      drugs: prescription.drugs,
      created: utils.timeString(prescription.created)
    };
    let pdfFile = await createPdf(options);
    pdfFileUrl = host + '/' + pdfFile;

    const message = genSmsMessage(options);
    // sendSms({ to: prescription.patient.phone, message });
    // send email to patient
    sendTemplateEmail({
      to: prescription.patient.email,
      subject: 'Rx-Link New Prescription',
      type: 2,
      patient:prescription.patient.fullname,
      doctor:prescription.doctor.fullname,
      attachments: [
        {
          // utf-8 string as an attachment
          filename: `${options.patientName}_${options.created}_rx-link.pdf`,
          path: pdfFileUrl
        }
      ]
    });
    // send email to pharmacy
    // sendEmail({
    //   to: prescription.pharmacy.email,
    //   subject: 'Rx-Link New Prescription',
    //   html: `Hi, ${prescription.pharmacy.trading_name}, please find your prescription from ${prescription.doctor.fullname} attached`,
    //   attachments: [
    //     {   // utf-8 string as an attachment
    //       filename: 'Prescription.pdf',
    //       content: pdfFile
    //     },
    //   ]
    // });
    // sendWhatsapp({ phone: prescription.patient.phone, message, attachs: ['https://rx-link.co.uk/media/1708982984336.pdf'] });
    // sendWhatsapp({ to: prescription.patient.phone, message, attachs: [pdfFileUrl] });
    fs.unlinkSync(qrcode);

    prescription.status = true;
    prescription.pdf = pdfFile;
    await prescription.save();
    res.json({ status: 'success' });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// patient autocomplete input data source
router.get('/autopatient', async (req, res) => {
  const { search } = req.query;
  try {
    let detail = await PatientModel.find({
      $and: [
        { belongsTo: req.user.practice },
        { $or: [{ email: { $regex: '.*' + search + '.*' } }, { fullname: { $regex: '.*' + search + '.*' } }] }
      ]
    }).limit(10);
    let result = [];
    for (record of detail) {
      record = record.toJSON();
      record.label = record.fullname + ', ' + record.email;
      result.push(record);
    }
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// pharmacy autocomplete input data source
router.get('/autopharmacy', async (req, res) => {
  const { search } = req.query;
  try {
    let detail = await PharmacyModel.find({
      $or: [{ post_code: { $regex: '.*' + search + '.*' } }, { trading_name: { $regex: '.*' + search + '.*' } }]
    }).limit(10);
    let result = [];
    for (record of detail) {
      record = record.toJSON();
      record.label = record.trading_name + ', ' + record.post_code;
      result.push(record);
    }
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
