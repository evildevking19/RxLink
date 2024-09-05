const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { isLoggedIn } = require("./middleware/auth.mid");
const { sendSms, sendWhatsapp } = require('./utils/twilio');
// sendSms('123', 'twilio test');
// sendWhatsapp('', 'twilio test');

const PORT = process.env.PORT || 8000;
const app = express();

//import routers
const homeRouter = require("./routers/home.router");
const authRouter = require("./routers/auth.router");
const dashboardRouter = require("./routers/dashboard.router");
const prescriptionRouter = require("./routers/prescription.router");
const patientRouter = require("./routers/patient.router");
const creditRouter = require("./routers/credit.router");
const fullfillRouter = require("./routers/fullfill.router");

// apply middlewares
app.use(cors());

app.use("/fullfill", fullfillRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "./frontend")));
app.use('/media', express.static(path.join(__dirname, './media')));

// apply routers
app.use("/api/home", homeRouter);
app.use("/api/auth", authRouter);
app.use("/api/dashboard", isLoggedIn, dashboardRouter);
app.use("/api/patient", isLoggedIn, patientRouter);
app.use("/api/prescription", isLoggedIn, prescriptionRouter);
app.use("/api/credit", isLoggedIn, creditRouter);

app.get("/test", (req, res) => {
  res.send("requested");
});

// show frontend
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./frontend", "index.html"));
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// console.log("Date now: ", Date.now().toString(16).toUpperCase());