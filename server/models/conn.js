require("dotenv").config(); // load .env variables
const mongoose = require("mongoose"); //import fresh mongoose object
const { log } = require("mercedlogger"); // import merced logger

//DESTRUCTURE ENV VARIABLES
const { DATABASE_URL } = process.env;

// CONNECT TO MONGO
try {
  mongoose.connect = mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // CONNECTION EVENTS
  mongoose.connection
    .on("open", () => log.green("DATABASE STATE", "Connection Open"))
    .on("close", () => log.magenta("DATABASE STATE", "Connection Close"))
    .on("error", (error) => log.red("DATABASE STATE", error));
} catch (err) {
  console.log(err);
}

// EXPORT CONNECTION
module.exports = mongoose;
