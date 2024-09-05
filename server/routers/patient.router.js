const { Router } = require('express'); // import router from express
const router = Router();

const PatientModel = require('../models/patient.model');
const ChartModel = require('../models/chart.model');
// get the list of patients
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

    let total = await PatientModel.countDocuments({ $and: [{ belongsTo: req.user.practice }, where] });
    let list = await PatientModel.find({ $and: [{ belongsTo: req.user.practice }, where] })
      .skip((page - 1) * count)
      .limit(count);

    res.json({ list, total });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// get detail of patient by id
router.get('/detail/:id', async (req, res) => {
  const id = req.query.id;
  try {
    let detail = await PatientModel.findById(id);
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

// delete patient by id
router.post('/delete', async (req, res) => {
  const id = req.body.id;
  try {
    await PatientModel.findByIdAndRemove(id);
    res.json({ status: 'success' });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// get detail of patient by id
router.post('/save', async (req, res) => {
  const { id, email, firstname, lastname, phone, birthday, nhs } = req.body;
  try {
    // check email exist
    const existUser = await PatientModel.findOne({ email });
    if (existUser && existUser._id != id) {
      return res.json({
        status: 'failed',
        error: 'Email already exists'
      });
    }

    if (id) {
      // update patient information
      let detail = await PatientModel.findById(id);
      detail.firstname = firstname;
      detail.lastname = lastname;
      detail.email = email;
      detail.birthday = birthday;
      detail.nhs = nhs;
      detail.phone = phone;
      await detail.save();
      res.json({ status: 'success', detail });
    } else {
      // add patient information
      let detail = await PatientModel.create({
        email,
        firstname,
        lastname,
        phone,
        birthday,
        nhs,
        belongsTo: req.user.practice
      });

      // log for statistics
      await ChartModel.log('patient');
      
      res.json({ status: 'success', detail });
    }
  } catch (err) {
    // console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
