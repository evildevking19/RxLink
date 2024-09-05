const { Router } = require("express"); // import router from express
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = Router();
const { isLoggedIn } = require("../middleware/auth.mid");
const UserModel = require("../models/user.model");
const PracticeModel = require("../models/practice.model");
const utils = require("../utils/common.js");
const twilio = require("../utils/twilio.js");
const SECRET = process.env.SECRET;

// Signup route to create a new user
router.post("/register", async (req, res) => {
  try {
    let existUser = await UserModel.find({ email: req.body.email });
    if (existUser.length !== 0) {
      res.json({
        status: "failed",
        error: "Oops! It looks like that email is already in use. Please try another one.",
      });
    } else {
      // create a new user
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user = await UserModel.create(req.body);

      // sign token and send it in response
      const token = await jwt.sign({
        uid: user._id,
        role: user.role,
        email: user.email,
        practice: user.practice
      }, SECRET, { expiresIn: 60 * 60 });
      const link = `${req.protocol}://${req.headers.host}/auth/verify/${token}`;
      twilio.sendTemplateEmail({
        to: req.body.email,
        type: 1,
        verifyLink: link,
        subject: 'Rx-Link account verify link',
      });
      res.json({
        status: "success",
        link
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// Login route to verify a user and get a token
router.post("/signin", async (req, res) => {

  let user = await UserModel.findOne({ email: req.body.email });
  if (user) {
    if (user.signinAttempt >= 3) {
      if (Date.now() < 60 * 1000 * (user.signinAttempt - 2) + Number.parseInt(user.signinAttemptTime))
        return res.json({ status: "failed", error: `Please try again after ${user.signinAttempt - 2} minutes` }); //wrong password
    }
    //check if password matches
    const result = await bcrypt.compare(req.body.password, user.password);
    if (result) {
      const verifyCode = utils.verifyCode();
      user.signinCode = verifyCode;
      user.signinAttempt = 0;
      await user.save();

      twilio.sendTemplateEmail({
        to: req.body.email,
        type: 0,
        verifycode: verifyCode,
        subject: `Rx-Link Verify Code`,
      });
      res.json({ status: "success", user, verifyCode });
    } else {
      user.signinAttempt = user.signinAttempt + 1;
      user.signinAttemptTime = Date.now();
      user.save();
      res.json({ status: "failed", error: "Invalid credential" }); //wrong password
    }
  } else {
    res.json({ error: "Invalid credential" }); //wrong email
  }
});




router.post("/forgotPassword", async (req, res) => {
  let user = await UserModel.findOne({ email: req.body.email });
  if (user) {
      const verifyCode = utils.verifyCode();
      user.signinCode = verifyCode;
      await user.save();

      twilio.sendTemplateEmail({
        to: req.body.email,
        type: 0,
        verifycode: verifyCode,
        subject: `Rx-Link Verify Code`,
      });
      res.json({ status: "success", user, verifyCode });
  } else {
    res.json({ error: "We couldn't find your account. Please check your email and try again." }); //wrong email
  }
});

router.post("/codeVerifyToForgot", async (req, res) => {
  const { verifyCode, email } = req.body;
  try {
    let user = await UserModel.findOne({ email });

    if (user) {
      if (user.signinCode == verifyCode) {
        return res.json({ status: "success", user });
      } else {
        res.json({ status: 'failed', error: 'Invalid verify code' });
      }
    }
  } catch (err) {
    console.log(err);
    // res.json({ status: 'failed', error: 'Invalid verify code' });
  }
});
router.post("/codeVerify", async (req, res) => {
  const { verifyCode, email } = req.body;
  try {
    let user = await UserModel.findOne({ email });

    if (user) {
      if (user.signinAttempt >= 3) {
        if (Date.now() < 60 * 1000 * (user.signinAttempt - 2) + Number.parseInt(user.signinAttemptTime))
          return res.json({ status: "failed", error: `Please try again after ${user.signinAttempt - 2} minutes` }); //wrong password
      }

      if (user.signinCode == verifyCode) {
        user.signinAttempt = 0;
        user.save();
        // sign token and send it in response
        const token = await jwt.sign(
          { uid: user._id, role: user.role, email: user.email, practice: user.practice },
          SECRET, { expiresIn: 60 * 60 }
        );
        return res.json({ status: "success", token, user });
      } else {
        user.signinAttempt = user.signinAttempt + 1;
        user.signinAttemptTime = Date.now();
        user.save();
        res.json({ status: 'failed', error: 'Invalid verify code' });
      }
    }
  } catch (err) {
    console.log(err);
    // res.json({ status: 'failed', error: 'Invalid verify code' });
  }
});

router.get("/signinbytoken", async (req, res) => {
  const token = req.query.token;
  if (token) {
    try {
      const tokenInfo = await jwt.verify(token, SECRET);
      const user = await UserModel.findById(tokenInfo.uid);
      return res.json({
        status: "success",
        user,
        token
      });
    } catch (err) {
      // console.log(err);
    }
  }
  return res.json({
    status: "failed"
  });
})

router.get("/verifyAccount", async (req, res) => {
  const token = req.query.token;
  if (token) {
    try {
      const tokenInfo = await jwt.verify(token, SECRET);
      const user = await UserModel.findById(tokenInfo.uid);
      user.status = 1;
      await user.save();

      const practice = user.practice;
      const practiceExist = await PracticeModel.countDocuments({ name: practice });
      if (!practiceExist) {
        await PracticeModel.create({ name: practice });
      }
      return res.json({
        status: "success",
        user,
        token
      });
    } catch (err) {
      console.log(err);
    }
  }
  return res.json({
    status: "failed"
  });
})

// update profile
router.post("/changeProfile", isLoggedIn, async (req, res) => {
  const { firstname, lastname, phone, practice, gmc } = req.body;
  let user = await UserModel.findById(req.user.uid);
  if (user) {
    user.fullname = firstname + ' ' + lastname;
    user.firstname = firstname;
    user.lastname = lastname;
    user.phone = phone;
    user.practice = practice;
    user.gmc = gmc;
    await user.save();

    const practiceExist = await PracticeModel.countDocuments({ name: practice });
    if (!practiceExist) {
      await PracticeModel.create({ name: practice });
    }
    res.json({ status: "success" });
  } else {
    res.json({ error: "Invalid data" });
  }
});

// change password
router.post("/changePassword", isLoggedIn, async (req, res) => {
  const { current, password } = req.body;
  let user = await UserModel.findById(req.user.uid);
  if (user) {
    const result = await bcrypt.compare(current, user.password);
    if (result) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      res.json({ status: "success" });
    } else {
      res.json({ status: "failed", error: 'Wrong password' });
    }
  } else {
    res.json({ error: "Invalid request" });
  }
});
router.post("/resetPassword", async (req, res) => {
  const { password, email } = req.body;
  let user = await UserModel.findOne({ email });
  if (user) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      res.json({ status: "success" });
  } else {
    res.json({ error: "Invalid request" });
  }
});

router.get("/getPracticeList", async (req, res) => {
  try {
    const result = await PracticeModel.find({});
    const list = result.map(item => item.name);
    return res.json({
      status: "success",
      list
    });
  } catch (err) {
    console.log(err);
  }
  return res.json({
    status: "failed",
    error: "Please try again."
  });
})
module.exports = router;