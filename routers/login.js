const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const router = express.Router();

// Code serveur
const secret = process.env.SERVER_CODE;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Dotenv
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// Models
const User = require("../models/userModel");

// ***** ROUTES ***** //

// LOGIN
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const usr = await User.findOne({ email });
  if (!usr) {
    res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, usr.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Ajout d'une "trace" à chaque requête d'un user
  usr.last_request = Date.now();
  const token = jwt.sign({ id: usr._id }, secret);

  res.cookie("jwtCookie", token, {
    expires: new Date(Date.now() + 1000 * 60 * 60), // Expiration du token à 1h
    httpOnly: true,
    secure: false,
  });

  res.status(200).json({
    message: "Auth cookie ready",
  });
});

// Export route
module.exports = router;
