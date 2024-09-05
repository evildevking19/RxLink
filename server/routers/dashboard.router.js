const { Router } = require('express'); // import router from express
const router = Router();

const PrescriptionModel = require('../models/prescription.model');
const UserModel = require('../models/user.model');
const PatientModel = require('../models/patient.model');
const PracticeModel = require('../models/practice.model');
const ChartModel = require('../models/chart.model');

// get detail of patient by id
router.get('/getStatistic', async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.uid);
    const verifys = user.verifyCount;
    const patients = await PatientModel.countDocuments({ belongsTo: req.user.practice });
    const prescriptions = await PrescriptionModel.countDocuments({ doctor: req.user.uid });
    const practice = await PracticeModel.findOne({ name: req.user.practice });

    const chart = await ChartModel.getChart();
    return res.json({ verifys, patients, prescriptions, credits: practice.credit, chart });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
