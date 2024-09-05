require("dotenv").config(); // loading env variables
const jwt = require("jsonwebtoken");

// MIDDLEWARE FOR AUTHORIZATION (MAKING SURE THEY ARE LOGGED IN)
const isLoggedIn = async (req, res, next) => {
  try {
    // check if auth header exists
    if (req.headers.authorization) {
      // parse token from header
      const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
      const payload = await jwt.verify(token, process.env.SECRET);
      req.user = payload;
      next();
    } else {
      res.status(400).send("Authorization failed");
    }
  } catch (err) {
    res.status(400).send('Authorization failed');
  }
};

// export custom middleware
module.exports = {
  isLoggedIn
};
