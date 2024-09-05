const { Router } = require('express'); // import router from express
const fs = require('fs');
const router = Router();

require('dotenv').config();
const PrescriptionModel = require('../models/prescription.model');
const UserModel = require('../models/user.model');
const ChartModel = require('../models/chart.model');
const { sendTemplateEmail } = require('../utils/twilio.js');
const utils = require('../utils/common.js');
const { genQRCode, createPdf } = require('../utils/media.js');

// get detail of patient by id
router.get('/detail', async (req, res) => {
  const host = req.protocol + '://' + req.headers.host;
  const { id, dob } = req.query;
  try {
    let detail = await PrescriptionModel.findOne({ rid: id, 'patient.birthday': dob })
      .populate('patient')
      .populate('pharmacy')
      .populate('doctor');
    if (detail) {
      if (!fs.existsSync(detail.pdf) && !detail.dispense) {
        const qrcode = await genQRCode(host + '/verify/' + detail.rid + '/' + detail.patient.birthday);
        const options = {
          rid: detail.rid,
          qrcode,
          host,
          doctorName: detail.doctor.fullname,
          doctorEmail: detail.doctor.email,
          doctorPhone: detail.doctor.phone,
          doctorGMC: detail.doctor.gmc,
          doctorPractice: detail.doctor.practice,
          patientName: detail.patient.fullname,
          patientEmail: detail.patient.email,
          patientBirthday: detail.patient.birthday,
          patientPhone: detail.patient.phone,
          patientNHS: detail.patient.nhs,
          drugs: detail.drugs,
          created: utils.timeString(detail.created)
        };
        await createPdf(options, detail.pdf);
        fs.unlinkSync(qrcode);
      }
      let user = await UserModel.findById(detail.doctor._id);
      user.verifyCount = user.verifyCount + 1;
      user.save();
      res.json({ status: 'success', detail });
    } else {
      res.json({ error: 'Invalid verify data' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// dispense prescription
router.get('/dispense', async (req, res) => {
  const { id, dob } = req.query;
  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataApiSecret = process.env.PINATA_API_SECRET;
  const pinataSDK = require('@pinata/sdk');

  const pinata = new pinataSDK({
    pinataApiKey: pinataApiKey,
    pinataSecretApiKey: pinataApiSecret
  });

  try {
    const filters = {
      status: 'pinned',
      metadata: {
        name: id
      }
    };

    const result = await pinata.pinList(filters);
    if (result.rows.length > 0) {
      return res.json({
        status: 'failed',
        error: 'This prescrioption is already dispensed.'
      });
    }

    let detail = await PrescriptionModel.findOne({ rid: id, 'patient.birthday': dob });
    if (detail) {
      if (detail.dispense) {
        return res.json({
          status: 'failed',
          error: 'This prescrioption is already dispensed.'
        });
      }

      const body = {
        status: true,
        rid: id,
        dob
      };
      const options = {
        pinataMetadata: {
          name: id,
          keyvalues: {
            rid: id
          }
        },
        pinataOptions: {
          cidVersion: 0
        }
      };
      const result = await pinata.pinJSONToIPFS(body, options);

      detail.dispense = true;
      detail.hash = result.IpfsHash;
      detail.save();
      fs.unlinkSync(detail.pdf);

      // log for statistics
      await ChartModel.log('dispense');

      res.json({ status: 'success', detail });
    } else {
      res.json({ error: 'Invalid Prescription information' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

router.post('/contact', async (req, res) => {
  const { fullname, email, phone, message } = req.body;
  const emailContent = `` + `<p>Name: ${fullname}</p>` + `<p>Email: ${email}</p>` + `<p>Phone: ${phone}</p>` + `<p>Message: ${message}</p>`;
  try {
    sendTemplateEmail({
      to: process.env.SEND_EMAIL,
      subject: `‘Contact-Us’ query from: ${fullname}.`,
      html: emailContent
    });
    return res.json({
      status: 'success'
    });
  } catch (err) {
    console.log(err);
  }
  res.json({ status: 'failed', error: 'Failed to send message. Please try again.' });
});

module.exports = router;
